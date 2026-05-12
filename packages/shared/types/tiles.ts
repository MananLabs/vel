// ═══════════════════════════════════════════════════════════
// VEL AI — Tile Type Definitions
// ═══════════════════════════════════════════════════════════

export const TILE_TYPES = [
  'ai-chat',
  'consensus',
  'terminal',
  'research',
  'docs',
  'slides',
  'website',
  'sheets',
  'cadam',
  'swarm',
  'workflow',
] as const;

export type TileType = (typeof TILE_TYPES)[number];

export interface TileConfig {
  type: TileType;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  maxTilesPerWorkspace: number;
  available: boolean;
}

export const TILE_CONFIGS: TileConfig[] = [
  {
    type: 'ai-chat',
    label: 'AI Chat',
    description: 'Conversation with any AI model',
    icon: '💬',
    color: '#8B5CF6',
    defaultWidth: 380,
    defaultHeight: 480,
    maxTilesPerWorkspace: 20,
    available: true,
  },
  {
    type: 'consensus',
    label: 'Consensus',
    description: '3 models answer simultaneously + AI synthesis',
    icon: '⚡',
    color: '#6D5FFF',
    defaultWidth: 720,
    defaultHeight: 560,
    maxTilesPerWorkspace: 5,
    available: true,
  },
  {
    type: 'terminal',
    label: 'AI Terminal',
    description: 'Terminal with AI command suggestions',
    icon: '▶',
    color: '#22C55E',
    defaultWidth: 480,
    defaultHeight: 360,
    maxTilesPerWorkspace: 3,
    available: true,
  },
  {
    type: 'research',
    label: 'Deep Research',
    description: 'Multi-pass web research agent',
    icon: '🔍',
    color: '#14B8A6',
    defaultWidth: 420,
    defaultHeight: 520,
    maxTilesPerWorkspace: 5,
    available: true,
  },
  {
    type: 'docs',
    label: 'Document',
    description: 'AI document generation & editing',
    icon: '📄',
    color: '#3B82F6',
    defaultWidth: 480,
    defaultHeight: 560,
    maxTilesPerWorkspace: 10,
    available: true,
  },
  {
    type: 'slides',
    label: 'Slides',
    description: 'AI presentation generation',
    icon: '🎯',
    color: '#EC4899',
    defaultWidth: 640,
    defaultHeight: 480,
    maxTilesPerWorkspace: 3,
    available: false,
  },
  {
    type: 'website',
    label: 'Website',
    description: 'Generate & preview websites',
    icon: '🌐',
    color: '#F59E0B',
    defaultWidth: 560,
    defaultHeight: 480,
    maxTilesPerWorkspace: 3,
    available: false,
  },
  {
    type: 'sheets',
    label: 'Sheets',
    description: 'AI spreadsheet & data analysis',
    icon: '📊',
    color: '#22C55E',
    defaultWidth: 560,
    defaultHeight: 400,
    maxTilesPerWorkspace: 5,
    available: false,
  },
  {
    type: 'cadam',
    label: 'CAD',
    description: 'Text-to-3D CAD generation',
    icon: '🧊',
    color: '#F59E0B',
    defaultWidth: 480,
    defaultHeight: 480,
    maxTilesPerWorkspace: 3,
    available: true,
  },
  {
    type: 'swarm',
    label: 'Agent Swarm',
    description: 'Multi-agent orchestration',
    icon: '🐝',
    color: '#EF4444',
    defaultWidth: 560,
    defaultHeight: 480,
    maxTilesPerWorkspace: 2,
    available: false,
  },
  {
    type: 'workflow',
    label: 'Workflow',
    description: 'Record & automate workflows',
    icon: '⚙️',
    color: '#6366F1',
    defaultWidth: 420,
    defaultHeight: 400,
    maxTilesPerWorkspace: 5,
    available: false,
  },
];

export const getTileConfig = (type: TileType): TileConfig | undefined =>
  TILE_CONFIGS.find((t) => t.type === type);

export const getAvailableTiles = (): TileConfig[] =>
  TILE_CONFIGS.filter((t) => t.available);
