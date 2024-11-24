const HOME_LOCAL_X_START = 35
const HOME_LOCAL_X_END = 65
const HOME_LOCAL_Y_START = 29
const HOME_LOCAL_Y_END = 41
const HOME_RULES_X_START = 35
const HOME_RULES_X_END = 65
const HOME_RULES_Y_START = 44
const HOME_RULES_Y_END = 56
const BACK_X_START = 3
const BACK_X_END = 20
const BACK_Y_START = 2
const BACK_Y_END = 13
const NEXT_X_START = 80
const NEXT_X_END = 100
const NEXT_Y_START = 0
const NEXT_Y_END = 10

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