const DENS = {
  YELLOW: {
    X: 3,
    Y: 0
  },
  RED: {
    X: 3,
    Y: 8
  }
}

const TRAP_SQUARES = {
  YELLOW: [
    {X: 2, Y: 0},
    {X: 4, Y: 0},
    {X: 3, Y: 1}
  ],
  RED: [
    {X: 2, Y: 8},
    {X: 4, Y: 8},
    {X: 3, Y: 7}
  ]
}

const ruleScreens = [
  'agilityrules',
  'eatinganimals',
  'howtowin',
  'jumpingoverwater',
  'ratsarespecial',
  'traps'
]

window.ruleScreens = ruleScreens
window.DENS = DENS
window.TRAP_SQUARES = TRAP_SQUARES