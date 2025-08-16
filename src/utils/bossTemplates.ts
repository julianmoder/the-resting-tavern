import { InteractionName } from '../types/base';

export const bossTemplates = [
  {
    name: 'Doomscroll',
    stats: {
      health: 1, // calculated
      maxHealth: 1, // calculated
      energy: 1, // calculated
      maxEnergy: 1, // calculated
      attack: 1, // calculated
      attackSpeed: 0.2,
      defense: 1, // calculated 
    },
    mechanics: [
      { 
        name:'Test Mechanic: Reaction',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.ReactionClick,
        duration: 2000,
        windupText: 'windup > Test Mechanic: Reaction',
        successText: 'success > Test Mechanic: Reaction',
        failText: 'fail > Test Mechanic: Reaction',
        damageBaseHero: 3,
      },
      { 
        name:'Test Mechanic: Mash',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.KeyMash,
        duration: 3000,
        windupText: 'windup > Test Mechanic: Mash',
        successText: 'success > Test Mechanic: Mash',
        failText: 'fail > Test Mechanic: Mash',
        damageBaseHero: 3,
      },
      { 
        name:'Test Mechanic: Dodge',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.DodgeDirection,
        duration: 4000,
        windupText: 'windup > Test Mechanic: Dodge',
        successText: 'success > windup > Test Mechanic: Dodge',
        failText: 'fail > windup > Test Mechanic: Dodge',
        damageBaseHero: 3,
      },
    ],
  }
];