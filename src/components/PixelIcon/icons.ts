// Pixel art replacements for the @mui/icons-material and Font Awesome icons
// used throughout the app. See createPixelIcon.tsx for the pixel map format.
//
// Every map is 12x12, so at MUI's default icon size (24px) each art pixel
// is exactly 2 CSS pixels.

import {
  createPixelIcon,
  flipX,
  flipY,
  PixelMap,
  rotate,
} from './createPixelIcon.js'

const chevronDown: PixelMap = [
  '............',
  '............',
  '............',
  '.##......##.',
  '.###....###.',
  '..###..###..',
  '...######...',
  '....####....',
  '.....##.....',
  '............',
  '............',
  '............',
]

const arrowDown: PixelMap = [
  '............',
  '.....##.....',
  '.....##.....',
  '.....##.....',
  '.....##.....',
  '.....##.....',
  '..#..##..#..',
  '..##.##.##..',
  '...######...',
  '....####....',
  '.....##.....',
  '............',
]

const heart: PixelMap = [
  '............',
  '..##....##..',
  '.####..####.',
  '############',
  '###+########',
  '##+#########',
  '.##########.',
  '..########..',
  '...######...',
  '....####....',
  '.....##.....',
  '............',
]

const zoomLens = (symbol: 'plus' | 'minus'): PixelMap => [
  '..#####.....',
  '.##...##....',
  '##..' + (symbol === 'plus' ? '#' : '.') + '..##...',
  '#...' + (symbol === 'plus' ? '#' : '.') + '...#...',
  '#.#####.#...',
  '#...' + (symbol === 'plus' ? '#' : '.') + '...#...',
  '##..' + (symbol === 'plus' ? '#' : '.') + '..##...',
  '.##...###...',
  '..#######...',
  '.......###..',
  '........###.',
  '.........##.',
]

export const KeyboardArrowDownIcon = createPixelIcon(
  chevronDown,
  'KeyboardArrowDown'
)
export const KeyboardArrowUpIcon = createPixelIcon(
  flipY(chevronDown),
  'KeyboardArrowUp'
)
export const KeyboardArrowLeftIcon = createPixelIcon(
  rotate(chevronDown),
  'KeyboardArrowLeft'
)
export const KeyboardArrowRightIcon = createPixelIcon(
  flipX(rotate(chevronDown)),
  'KeyboardArrowRight'
)
export const ExpandMoreIcon = createPixelIcon(chevronDown, 'ExpandMore')

export const ArrowDownwardIcon = createPixelIcon(arrowDown, 'ArrowDownward')
export const ArrowUpwardIcon = createPixelIcon(flipY(arrowDown), 'ArrowUpward')

export const ArrowDropDownIcon = createPixelIcon(
  [
    '............',
    '............',
    '............',
    '............',
    '..########..',
    '...######...',
    '....####....',
    '.....##.....',
    '............',
    '............',
    '............',
    '............',
  ],
  'ArrowDropDown'
)

export const MenuIcon = createPixelIcon(
  [
    '............',
    '............',
    '.##########.',
    '.##########.',
    '............',
    '.##########.',
    '.##########.',
    '............',
    '.##########.',
    '.##########.',
    '............',
    '............',
  ],
  'Menu'
)

export const HotelIcon = createPixelIcon(
  [
    '............',
    '............',
    '#...........',
    '#...........',
    '#.##........',
    '#.##.######.',
    '#....#######',
    '############',
    '############',
    '#..........#',
    '#..........#',
    '............',
  ],
  'Hotel'
)

export const SettingsIcon = createPixelIcon(
  [
    '....####....',
    '.##.####.##.',
    '.##########.',
    '..########..',
    '#####..#####',
    '####....####',
    '####....####',
    '#####..#####',
    '..########..',
    '.##########.',
    '.##.####.##.',
    '....####....',
  ],
  'Settings'
)

export const FlashOnIcon = createPixelIcon(
  [
    '......####..',
    '.....####...',
    '....####....',
    '...####.....',
    '..########..',
    '..#######...',
    '.....###....',
    '....###.....',
    '....##......',
    '...##.......',
    '...#........',
    '............',
  ],
  'FlashOn'
)

export const BookIcon = createPixelIcon(
  [
    '............',
    '..#########.',
    '.#+########.',
    '.#+##....##.',
    '.#+########.',
    '.#+########.',
    '.#+########.',
    '.#+########.',
    '.#+########.',
    '.##########.',
    '.#+++++++++.',
    '..#########.',
  ],
  'Book'
)

export const AssessmentIcon = createPixelIcon(
  [
    '.##########.',
    '############',
    '########..##',
    '########..##',
    '#####..#..##',
    '#####..#..##',
    '##..#..#..##',
    '##..#..#..##',
    '##..#..#..##',
    '##..#..#..##',
    '############',
    '.##########.',
  ],
  'Assessment'
)

export const BeenhereIcon = createPixelIcon(
  [
    '.##########.',
    '.##########.',
    '.#######..#.',
    '.######..##.',
    '.#..##..###.',
    '.##....####.',
    '.###..#####.',
    '.##########.',
    '.##########.',
    '.####..####.',
    '.###....###.',
    '.##......##.',
  ],
  'Beenhere'
)

export const AssignmentLateIcon = createPixelIcon(
  [
    '....####....',
    '.##.####.##.',
    '.##########.',
    '.####..####.',
    '.####..####.',
    '.####..####.',
    '.####..####.',
    '.##########.',
    '.####..####.',
    '.##########.',
    '.##########.',
    '.##########.',
  ],
  'AssignmentLate'
)

export const AccountBalanceIcon = createPixelIcon(
  [
    '.....##.....',
    '...######...',
    '.##########.',
    '############',
    '............',
    '.##..##..##.',
    '.##..##..##.',
    '.##..##..##.',
    '.##..##..##.',
    '.##########.',
    '############',
    '############',
  ],
  'AccountBalance'
)

export const ZoomInIcon = createPixelIcon(zoomLens('plus'), 'ZoomIn')
export const ZoomOutIcon = createPixelIcon(zoomLens('minus'), 'ZoomOut')

export const HeartIcon = createPixelIcon(heart, 'Heart')

export const HeartOutlineIcon = createPixelIcon(
  [
    '............',
    '..##....##..',
    '.#..#..#..#.',
    '#....##....#',
    '#..........#',
    '#..........#',
    '.#........#.',
    '..#......#..',
    '...#....#...',
    '....#..#....',
    '.....##.....',
    '............',
  ],
  'HeartOutline'
)

export const FemaleIcon = createPixelIcon(
  [
    '...######...',
    '..##....##..',
    '.##......##.',
    '.##......##.',
    '.##......##.',
    '..##....##..',
    '...######...',
    '.....##.....',
    '...######...',
    '.....##.....',
    '.....##.....',
    '............',
  ],
  'Female'
)

export const MaleIcon = createPixelIcon(
  [
    '......######',
    '......######',
    '.........###',
    '........####',
    '..####.##.##',
    '.##..###....',
    '##....##....',
    '##....##....',
    '##....##....',
    '##....##....',
    '.##..##.....',
    '..####......',
  ],
  'Male'
)

const circle = (holes: Record<number, string>): PixelMap =>
  [
    '...######...',
    '.##########.',
    '.##########.',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '.##########.',
    '.##########.',
    '...######...',
  ].map((row, y) => holes[y] ?? row)

export const SuccessIcon = createPixelIcon(
  circle({
    3: '########..##',
    4: '#######..###',
    5: '##..##..####',
    6: '###....#####',
    7: '####..######',
  }),
  'Success'
)

export const InfoIcon = createPixelIcon(
  circle({
    2: '.####..####.',
    5: '#####..#####',
    6: '#####..#####',
    7: '#####..#####',
    8: '#####..#####',
    9: '.####..####.',
  }),
  'Info'
)

export const ErrorIcon = createPixelIcon(
  circle({
    2: '.####..####.',
    3: '#####..#####',
    4: '#####..#####',
    5: '#####..#####',
    6: '#####..#####',
    8: '#####..#####',
    9: '.####..####.',
  }),
  'Error'
)

export const WarningIcon = createPixelIcon(
  [
    '.....##.....',
    '.....##.....',
    '....####....',
    '....#..#....',
    '...##..##...',
    '...##..##...',
    '..###..###..',
    '..########..',
    '.####..####.',
    '.##########.',
    '############',
    '............',
  ],
  'Warning'
)

const checkbox = (holes: Record<number, string>): PixelMap =>
  [
    '.##########.',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '############',
    '.##########.',
  ].map((row, y) => holes[y] ?? row)

export const CheckBoxOutlineBlankIcon = createPixelIcon(
  checkbox(
    Object.fromEntries([2, 3, 4, 5, 6, 7, 8, 9].map(y => [y, '##........##']))
  ),
  'CheckBoxOutlineBlank'
)

export const CheckBoxIcon = createPixelIcon(
  checkbox({
    3: '########..##',
    4: '#######..###',
    5: '##..##..####',
    6: '###....#####',
    7: '####..######',
  }),
  'CheckBox'
)

export const IndeterminateCheckBoxIcon = createPixelIcon(
  checkbox({
    5: '###......###',
    6: '###......###',
  }),
  'IndeterminateCheckBox'
)
