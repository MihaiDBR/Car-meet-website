// ============================================================
// DropDown Romania — Shared constants & data
// Loaded as a plain <script> before the Babel JSX files so
// all components can reference these as globals.
// ============================================================

// ----- URLs -----
const TICKET_URL    = 'https://bilet.ro/eveniment/drop-down-editia-a-a-17916';
const INSTAGRAM_URL = 'https://instagram.com/dropdownromania';
const WEBSITE_URL   = 'https://dropdown.ro';
const EMAIL         = 'inscrieri@dropdown.ro';

// ----- Car 360 showcase -----
// Generate frames with:
//   ffmpeg -i car_rotation.mp4 -t 6 -vf "fps=25,scale=1920:-1" -q:v 2 frames/frame_%04d.jpg
const TOTAL_FRAMES = 150; // fps=25 × 6s

const CAR360_SLIDES = [
  { chapter: '01/04', eyebrow: 'CAR CULTURE · RO',   title: 'DROPDOWN',    desc: 'Cel mai mare car meeting din România. 500+ mașini modificate, 15.000 de spectatori. Are you down for it?' },
  { chapter: '02/04', eyebrow: 'DATA EVENIMENTULUI',  title: '13–14 IUNIE', desc: 'Porțile se deschid sâmbătă, 13 Iunie, la ora 10:00. 48 de ore non-stop de adrenalință pură.' },
  { chapter: '03/04', eyebrow: 'LOCAȚIE · BUCUREȘTI', title: 'ST. STEAUA',  desc: 'Bd. Ghencea 45, Sector 6 — cea mai mare arenă din România transformată în sanctuarul mașinilor modificate.' },
  { chapter: '04/04', eyebrow: 'ÎNSCRIE MAȘINA',      title: '500+ LOCURI', desc: 'Locurile se ocupă rapid. Completează formularul de mai jos și asigură-ți locul alături de cele mai tari mașini.' },
];

// ----- Horizontal categories panels -----
const PANELS = [
  { num: '01', name: 'STANCE',       desc: 'Coborâte la milimetru. Offset extrem, camber agresiv, iarba atinsă.',    vert: 'LOWERED / SLAMMED', hue: 215, icon: '◇' },
  { num: '02', name: 'TUNING',       desc: 'Putere brută. Turbo, swap-uri, stage builds. Daily → track monster.',     vert: 'BOOST / POWER',     hue: 225, icon: '△' },
  { num: '03', name: 'SHOW & SHINE', desc: 'Detailing perfecțiune. Wrap, paint correction, fiecare detaliu contează.', vert: 'CLEAN / PRISTINE',  hue: 235, icon: '○' },
  { num: '04', name: 'DRIFT',        desc: 'Cauciucuri arse, unghiuri imposibile. Fum și adrenalință pură.',           vert: 'SMOKE / ANGLE',     hue: 245, icon: '▽' },
];

// ----- Gallery items -----
// Swap src: '' with '/path/to/photo.jpg' to use real images.
// Gradient placeholders are shown automatically when src is empty.
const GALLERY_ITEMS = [
  { id: 1, hue: 220, label: 'STANCE',  span: 'tall', src: '' },
  { id: 2, hue: 0,   label: 'DRIFT',   span: 'wide', src: '' },
  { id: 3, hue: 280, label: 'JDM',     span: '',     src: '' },
  { id: 4, hue: 30,  label: 'EURO',    span: '',     src: '' },
  { id: 5, hue: 200, label: 'GRID',    span: 'tall', src: '' },
  { id: 6, hue: 340, label: 'BURNOUT', span: 'wide', src: '' },
  { id: 7, hue: 160, label: 'SHOW',    span: '',     src: '' },
  { id: 8, hue: 50,  label: 'NIGHT',   span: '',     src: '' },
  { id: 9, hue: 260, label: 'TRACK',   span: 'wide', src: '' },
];
