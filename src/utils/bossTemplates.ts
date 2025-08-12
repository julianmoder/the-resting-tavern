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
        name:'Curse of Dehydration',
        chance: 0.15,
        windup: 1500,
        duration: 2000,
      },
    ],
  }
];