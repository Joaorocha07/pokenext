import { useCallback, useMemo, useState } from 'react'

import { Pokemon } from '@/services/pokeapi/types'
import { pokemonService } from '@/services/pokeapi/pokemonService'

type AbilityEffect = 
  | { type: 'buff'; stat: 'attack' | 'defense'; value: number }
  | { type: 'debuff'; stat: 'attack' | 'defense'; value: number }
  | { type: 'reveal'; target: 'type' | 'stats' | 'all' }
  | { type: 'neutral' }

export interface SecretAbility {
  id: string
  icon: string
  color: string
  effect: AbilityEffect
  used: boolean
}

export interface BattlePokemon extends Pokemon {
  currentHp: number
  maxHp: number
  buffs: { attack: number; defense: number }
  revealed: { type: boolean; stats: boolean }
}

export interface BattleTeam {
  player: BattlePokemon[]
  machine: BattlePokemon[]
}

export type BattlePhase = 
  | 'selection'
  | 'abilities'
  | 'battle'
  | 'result'
  | 'victory'
  | 'defeat'

const ABILITY_POOL: Omit<SecretAbility, 'id' | 'used'>[] = [
  { icon: '⚔️', color: 'from-red-500 to-orange-500', effect: { type: 'buff', stat: 'attack', value: 25 } },
  { icon: '🛡️', color: 'from-blue-500 to-cyan-500', effect: { type: 'buff', stat: 'defense', value: 25 } },
  { icon: '💥', color: 'from-purple-500 to-pink-500', effect: { type: 'debuff', stat: 'attack', value: 20 } },
  { icon: '🌑', color: 'from-gray-600 to-gray-800', effect: { type: 'debuff', stat: 'defense', value: 20 } },
  { icon: '👁️', color: 'from-yellow-400 to-amber-500', effect: { type: 'reveal', target: 'type' } },
  { icon: '🔮', color: 'from-indigo-500 to-purple-600', effect: { type: 'reveal', target: 'stats' } },
  { icon: '✨', color: 'from-emerald-400 to-teal-500', effect: { type: 'reveal', target: 'all' } },
  { icon: '🎲', color: 'from-zinc-400 to-zinc-600', effect: { type: 'neutral' } },
]

const TYPE_ADVANTAGES: Record<string, string[]> = {
  fire: ['grass', 'bug', 'ice', 'steel'],
  water: ['fire', 'ground', 'rock'],
  grass: ['water', 'ground', 'rock'],
  electric: ['water', 'flying'],
  ice: ['grass', 'ground', 'flying', 'dragon'],
  fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison: ['grass', 'fairy'],
  ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'poison'],
  bug: ['grass', 'psychic', 'dark'],
  rock: ['fire', 'ice', 'flying', 'bug'],
  ghost: ['psychic', 'ghost'],
  dragon: ['dragon'],
  dark: ['psychic', 'ghost'],
  steel: ['ice', 'rock', 'fairy'],
  fairy: ['fighting', 'dragon', 'dark'],
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    fire: 'orange',
    water: 'blue',
    grass: 'emerald',
    electric: 'yellow',
    ice: 'cyan',
    fighting: 'red',
    poison: 'purple',
    ground: 'amber',
    flying: 'sky',
    psychic: 'pink',
    bug: 'lime',
    rock: 'stone',
    ghost: 'violet',
    dragon: 'indigo',
    dark: 'zinc',
    steel: 'slate',
    fairy: 'rose',
    normal: 'gray',
  }

  return colors[type] || 'gray'
}

export function useBattle() {
  const [currentRound, setCurrentRound] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [phase, setPhase] = useState<BattlePhase>('selection')
  const [abilities, setAbilities] = useState<SecretAbility[]>([])
  const [team, setTeam] = useState<BattleTeam>({ player: [], machine: [] })

  const [selectedAbilityId, setSelectedAbilityId] = 
    useState<string | null>(null)

  // Gerar habilidades aleatórias
  const generateAbilities = useCallback(() => {
    const shuffled = [...ABILITY_POOL].sort(() => Math.random() - 0.5)

    return shuffled.slice(0, 3).map((ability, index) => ({
      ...ability,
      id: `ability-${index}-${Date.now()}`,
      used: false,
    }))
  }, [])

  // Inicializar time da máquina
  const generateMachineTeam = useCallback(async () => {
    const machineIds = Array.from({ 
        length: 3 }, () => Math.floor(Math.random() * 151) + 1)
    const machinePokemons = await Promise.all(
      machineIds.map(id => pokemonService.getByIdOrName(id))
    )
    
    return machinePokemons.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100,
      maxHp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100,
      buffs: { attack: 0, defense: 0 },
      revealed: { type: false, stats: false },
    }))
  }, [])

  // Inicializar batalha
  const startBattle = useCallback(async (selectedPokemons: Pokemon[]) => {
    const playerTeam = selectedPokemons.map(pokemon => ({
      ...pokemon,
      currentHp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100,
      maxHp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100,
      buffs: { attack: 0, defense: 0 },
      revealed: { type: true, stats: true },
    }))

    const machineTeam = await generateMachineTeam()
    
    setTeam({ player: playerTeam, machine: machineTeam })
    setAbilities(generateAbilities())
    setCurrentRound(0)
    setBattleLog([])
    setSelectedAbilityId(null)
    setPhase('abilities')
  }, [generateMachineTeam, generateAbilities])

  // Calcular multiplicador de tipo
  const getTypeMultiplier = useCallback(
    (attacker: BattlePokemon, defender: BattlePokemon) => {
    const attackerTypes = attacker.types.map(t => t.type.name)
    const defenderTypes = defender.types.map(t => t.type.name)
    
    let multiplier = 1

    attackerTypes.forEach(atkType => {
      defenderTypes.forEach(defType => {
        if (TYPE_ADVANTAGES[atkType]?.includes(defType)) multiplier *= 2
        if (TYPE_ADVANTAGES[defType]?.includes(atkType)) multiplier *= 0.5
      })
    })
    
    return multiplier
  }, [])

  // Calcular dano
  const calculateDamage = useCallback((
    attacker: BattlePokemon, defender: BattlePokemon) => {
    const attackStat = attacker.stats.find(s => s.stat.name === 'attack')?.base_stat || 50
    const defenseStat = defender.stats.find(s => s.stat.name === 'defense')?.base_stat || 50
    
    const attack = attackStat + attacker.buffs.attack
    const defense = defenseStat + defender.buffs.defense
    const typeMultiplier = getTypeMultiplier(attacker, defender)
    
    const baseDamage = ((2 * 50 / 5 + 2) * 60 * (attack / defense)) / 50 + 2
    const finalDamage = Math.floor(
        baseDamage * typeMultiplier * (0.85 + Math.random() * 0.15))
    
    return {
      damage: Math.max(1, finalDamage),
      multiplier: typeMultiplier,
      isCritical: Math.random() < 0.0625,
    }
  }, [getTypeMultiplier])

  // Usar habilidade
  const useAbility = useCallback((abilityId: string) => {
    const ability = abilities.find(a => a.id === abilityId)

    if (!ability || ability.used) return

    setSelectedAbilityId(abilityId)
    
    setTeam(prev => {
      const newTeam = { ...prev }
      const currentPlayerPoke = newTeam.player[currentRound]
      const currentMachinePoke = newTeam.machine[currentRound]

      if (ability.effect.type === 'buff') {
        currentPlayerPoke.buffs[ability.effect.stat] += ability.effect.value
      } else if (ability.effect.type === 'debuff') {
        currentPlayerPoke.buffs[ability.effect.stat] -= ability.effect.value
      } else if (ability.effect.type === 'reveal') {
        if (ability.effect.target === 'type' || ability.effect.target === 'all') {
          currentMachinePoke.revealed.type = true
        }
        if (ability.effect.target === 'stats' || ability.effect.target === 'all') {
          currentMachinePoke.revealed.stats = true
        }
      }

      return newTeam
    })

    setAbilities(prev => prev.map(a => 
      a.id === abilityId ? { ...a, used: true } : a
    ))
  }, [abilities, currentRound])

  // Executar batalha
  const executeBattle = useCallback(() => {
    const playerPoke = team.player[currentRound]
    const machinePoke = team.machine[currentRound]
    
    if (!playerPoke || !machinePoke) return

    const playerResult = calculateDamage(playerPoke, machinePoke)
    const machineResult = calculateDamage(machinePoke, playerPoke)
    
    const playerDamage = playerResult.isCritical 
      ? Math.floor(playerResult.damage * 1.5) 
      : playerResult.damage
    const machineDamage = machineResult.damage

    setTeam(prev => {
      const newTeam = { ...prev }

      newTeam.machine[currentRound].currentHp = 
        Math.max(0, machinePoke.currentHp - playerDamage)
      newTeam.player[currentRound].currentHp = 
        Math.max(0, playerPoke.currentHp - machineDamage)

      return newTeam
    })

    const logs = [
      `⚔️ ${playerPoke.name} ataca!`,
      playerResult.isCritical ? '💥 Golpe Crítico!' : '',
      playerResult.multiplier > 1 ? '🔥 Super efetivo!' : playerResult.multiplier < 1 ? '💧 Não muito efetivo...' : '',
      `💨 Causou ${playerDamage} de dano!`,
      ``,
      `🛡️ ${machinePoke.name} contra-ataca!`,
      machineResult.multiplier > 1 ? '🔥 Super efetivo!' : machineResult.multiplier < 1 ? '💧 Não muito efetivo...' : '',
      `💨 Causou ${machineDamage} de dano!`,
    ].filter(Boolean)

    setBattleLog(logs)
    setPhase('battle')

    setTimeout(() => {
      setPhase('result')
    }, 2500)
  }, [team, currentRound, calculateDamage])

  // Próximo round
  const nextRound = useCallback(() => {
    if (currentRound < 2) {
      setCurrentRound(prev => prev + 1)
      setSelectedAbilityId(null)
      setAbilities(generateAbilities())
      setPhase('abilities')
    } else {
      const playerWins = team.player.filter(p => p.currentHp > 0).length
      const machineWins = team.machine.filter(p => p.currentHp > 0).length
      
      setPhase(playerWins > machineWins ? 'victory' : 'defeat')
    }
  }, [currentRound, team, generateAbilities])

  // Resetar batalha
  const resetBattle = useCallback(() => {
    setPhase('selection')
    setTeam({ player: [], machine: [] })
    setAbilities([])
    setCurrentRound(0)
    setBattleLog([])
    setSelectedAbilityId(null)
  }, [])

  // Stats do round atual
  const currentRoundStats = useMemo(() => {
    if (team.player.length === 0) return null
    
    const playerPoke = team.player[currentRound]
    const machinePoke = team.machine[currentRound]
    
    if (!playerPoke || !machinePoke) return null

    return {
      player: playerPoke,
      machine: machinePoke,
      playerWon: machinePoke.currentHp <= 0 && playerPoke.currentHp > 0,
      machineWon: playerPoke.currentHp <= 0 && machinePoke.currentHp > 0,
      draw: playerPoke.currentHp <= 0 && machinePoke.currentHp <= 0,
    }
  }, [team, currentRound])

  // Stats finais
  const finalStats = useMemo(() => {
    const playerWins = team.player.filter(p => p.currentHp > 0).length
    const machineWins = team.machine.filter(p => p.currentHp > 0).length

    return { playerWins, machineWins, totalRounds: 3 }
  }, [team])

  return {
    team,
    phase,
    battleLog,
    abilities,
    finalStats,
    currentRound,
    selectedAbilityId,
    currentRoundStats,
    setPhase,
    nextRound,
    useAbility,
    startBattle,
    resetBattle,
    executeBattle
  }
}