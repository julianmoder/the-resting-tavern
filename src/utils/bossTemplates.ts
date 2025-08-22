import { InteractionName } from '../types/base';

export const bossTemplates = [
  {
    name: 'Placeholdor',
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
        name:'Placeholder Reaction',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.ReactionClick,
        duration: 2000,
        windupText: 'Let\'s see how quick you are!',
        successText: 'Perfect! I straighten my posture and ready myself.',
        failText: 'Not even close!',
        damageBaseHero: 3,
      },
      { 
        name:'Placeholder Mash',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.KeyMash,
        duration: 3000,
        windupText: 'Be fast or be replaced!',
        successText: 'Danger passed! I need to loosen my hands and breathe.',
        failText: 'HAHA! You\'re no real hero!',
        damageBaseHero: 3,
      },
      { 
        name:'Placeholder Dodge',
        chance: 0.25,
        windup: 3000,
        interaction: InteractionName.DodgeDirection,
        duration: 4000,
        windupText: 'Try to dodge this!',
        successText: 'Masterfully evaded! A quick stretch and I forge on.',
        failText: 'You\'re not as flexible as you think!',
        damageBaseHero: 3,
      },
    ],
  }
];