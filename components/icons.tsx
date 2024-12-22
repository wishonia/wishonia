import { ChevronLeft as LucideChevronLeft } from "lucide-react"
import {
  AiFillGithub,
  AiFillGoogleCircle,
  AiOutlineBug,
  AiOutlineClose,
  AiOutlineCopy,
  AiOutlineEllipsis,
  AiOutlinePlus,
  AiOutlineWarning,
} from "react-icons/ai"
import { BiCalendar, BiHistory } from "react-icons/bi"
import {
  BsActivity,
  BsCheck2,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
  BsFire,
  BsMoonStars,
  BsSun,
  BsWikipedia,
} from "react-icons/bs"
import {
  FaBell,
  FaBomb,
  FaBook,
  FaBookMedical,
  FaCamera,
  FaChartBar,
  FaChartPie,
  FaDisease,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaHome, FaInbox,
  FaLightbulb,
  FaMoneyBill,
  FaPeace, FaPills,
  FaQuestionCircle,
  FaRegStar,
  FaRobot,
  FaSadCry,
  FaScroll,
  FaSkull,
  FaSort,
  FaUserAlt,
  FaVoteYea,
} from "react-icons/fa"
import {
  FaGoogleScholar,
  FaHand,
  FaHouseLock, FaMagnifyingGlass,
  FaMessage,
  FaPencil,
  FaRankingStar,
  FaShieldHalved,
  FaSquarePollVertical,
} from "react-icons/fa6"
import { ImSpinner8, ImStatsBars } from "react-icons/im"
import { LuSettings } from "react-icons/lu"
import { MdDeleteForever, MdOutlineLogout } from "react-icons/md"
import { RxDashboard, RxMixerHorizontal, RxPencil1 } from "react-icons/rx"
import { FaBuilding, FaScaleBalanced, FaFileLines } from "react-icons/fa6"
import { BsPencilSquare } from "react-icons/bs"

export type IconKeys = keyof typeof icons

type IconsType = {
  [key in IconKeys]: React.ElementType
}

const icons = {
  // Providers
  google: AiFillGoogleCircle,
  github: AiFillGithub,
  bug: AiOutlineBug,

  // Dashboard Icons
  dashboard: RxDashboard,
  activity: BsActivity,
  measurement: RxPencil1,
  settings: LuSettings,
  camera: FaCamera,
  write: FaMessage,
  wishingWell: BsActivity,
  bomb: FaBomb,
  skull: FaSkull,
  vote: FaVoteYea,
  health: FaBookMedical,
  peace: FaPeace,
  results: FaSquarePollVertical,
  disease: FaDisease,
  home: FaHome,
  frown: FaSadCry,
  pieChart: FaChartPie,
  docs: FaBook,
  robot: FaRobot,
  scroll: FaScroll,
  safe: FaHouseLock,
  conditions: FaDisease,
  treatments:  FaPills,
  search: FaMagnifyingGlass,
  trials: FaChartBar,
  measurements: RxPencil1,
  userVariables: FaUserAlt,
  predictorSearch: FaMagnifyingGlass,
  inbox: FaInbox,

  clipboard: AiOutlineCopy,

  // Mode Toggle
  moon: BsMoonStars,
  sun: BsSun,

  // Navigation
  back: BsChevronLeft,
  next: BsChevronRight,
  up: BsChevronUp,
  down: BsChevronDown,
  close: AiOutlineClose,

  // Common
  trash: MdDeleteForever,
  spinner: ImSpinner8,
  userAlt: FaUserAlt,
  ellipsis: AiOutlineEllipsis,
  warning: AiOutlineWarning,
  add: AiOutlinePlus,
  reminder: FaBell,
  history: BiHistory,
  charts: FaChartBar,
  signout: MdOutlineLogout,
  calendar: BiCalendar,
  sort: FaSort,
  fire: BsFire,
  statsBar: ImStatsBars,
  mixer: RxMixerHorizontal,
  check: BsCheck2,
  star: FaRegStar,
  ranking: FaRankingStar,
  question: FaQuestionCircle,
  volunteer: FaHand,
  lightbulb: FaLightbulb,
  edit: FaEdit,
  eye: FaEye,
  eyeOff: FaEyeSlash,
  book: FaBook,
  pencil: FaPencil,
  chevronLeft: LucideChevronLeft,
  shield: FaShieldHalved,
  wiki: BsWikipedia,
  studies: FaGoogleScholar,
  petition: FaScroll,
  savings: FaMoneyBill,

  // Add these new icons
  document: FaFileLines,      // For articles
  building: FaBuilding,       // For organizations
  pencilSquare: BsPencilSquare, // For petitions
  scale: FaScaleBalanced,     // For warVsCures comparison
}

export const Icons: IconsType = icons