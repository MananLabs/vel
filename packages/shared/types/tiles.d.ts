export declare const TILE_TYPES: readonly ["ai-chat", "consensus", "terminal", "research", "docs", "slides", "website", "sheets", "cadam", "swarm", "workflow"];
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
export declare const TILE_CONFIGS: TileConfig[];
export declare const getTileConfig: (type: TileType) => TileConfig | undefined;
export declare const getAvailableTiles: () => TileConfig[];
