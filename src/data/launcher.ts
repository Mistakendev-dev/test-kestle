/**
 * Demo configuration for the delivery-client showcase.
 *
 * Every control here is a visual demonstration of the interface only — nothing
 * is wired to external software, an account, or a backend. Replace these arrays
 * to change what the showcase presents.
 */

export type LauncherControl =
  | { kind: 'toggle'; id: string; label: string; hint: string; value: boolean }
  | { kind: 'check'; id: string; label: string; hint: string; value: boolean }
  | {
      kind: 'slider';
      id: string;
      label: string;
      hint: string;
      value: number;
      min: number;
      max: number;
      step: number;
      unit: string;
    }
  | { kind: 'select'; id: string; label: string; hint: string; value: string; options: string[] };

export type ControlValue = boolean | number | string;

export interface VaultEntry {
  id: string;
  game: string;
  name: string;
  status: 'Ready' | 'Delivered' | 'Queued';
}

export interface LauncherPane {
  id: string;
  label: string;
  title: string;
  blurb: string;
  controls: LauncherControl[];
  entries?: VaultEntry[];
}

export const launcherPanes: LauncherPane[] = [
  {
    id: 'library',
    label: 'Library',
    title: 'Account library',
    blurb: 'Everything you have purchased, collected in one place.',
    entries: [
      { id: 'v1', game: 'rust', name: 'Rust Steam NFA', status: 'Ready' },
      { id: 'v2', game: 'cs2', name: 'CS2 Prime Ranked', status: 'Delivered' },
      { id: 'v3', game: 'gta5', name: 'GTA V Modded', status: 'Ready' },
      { id: 'v4', game: 'tarkov', name: 'Tarkov EOD', status: 'Queued' },
    ],
    controls: [
      {
        kind: 'select',
        id: 'librarySort',
        label: 'Sort library',
        hint: 'Choose how entries are ordered.',
        value: 'Recently added',
        options: ['Recently added', 'Game A–Z', 'Status'],
      },
      {
        kind: 'toggle',
        id: 'groupByGame',
        label: 'Group by game',
        hint: 'Collect entries under their title.',
        value: true,
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    title: 'Delivery preferences',
    blurb: 'How credentials are handed over once an order completes.',
    controls: [
      {
        kind: 'toggle',
        id: 'instantHandoff',
        label: 'Instant handoff',
        hint: 'Reveal details as soon as an order is ready.',
        value: true,
      },
      {
        kind: 'select',
        id: 'region',
        label: 'Preferred region',
        hint: 'Used to pick the closest delivery node.',
        value: 'Europe West',
        options: ['Europe West', 'Europe North', 'North America', 'Asia Pacific'],
      },
      {
        kind: 'slider',
        id: 'retryWindow',
        label: 'Retry window',
        hint: 'How long the client keeps retrying a handoff.',
        value: 30,
        min: 5,
        max: 60,
        step: 5,
        unit: 'min',
      },
      {
        kind: 'check',
        id: 'emailCopy',
        label: 'Send me a copy',
        hint: 'Mirror the handoff to your inbox.',
        value: false,
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    title: 'Security',
    blurb: 'Local protections applied to stored credentials.',
    controls: [
      {
        kind: 'toggle',
        id: 'maskCredentials',
        label: 'Mask credentials',
        hint: 'Hide passwords until you reveal them.',
        value: true,
      },
      {
        kind: 'slider',
        id: 'autoLock',
        label: 'Auto-lock after',
        hint: 'Lock the client when left idle.',
        value: 10,
        min: 1,
        max: 30,
        step: 1,
        unit: 'min',
      },
      {
        kind: 'select',
        id: 'twoFactor',
        label: 'Two-factor prompt',
        hint: 'When to ask for a second factor.',
        value: 'On reveal',
        options: ['On reveal', 'Every launch', 'Never'],
      },
      {
        kind: 'check',
        id: 'clearClipboard',
        label: 'Clear clipboard',
        hint: 'Wipe copied details after 60 seconds.',
        value: true,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Client settings',
    blurb: 'Appearance and behaviour of the delivery client.',
    controls: [
      {
        kind: 'select',
        id: 'theme',
        label: 'Theme',
        hint: 'Interface colour treatment.',
        value: 'Midnight',
        options: ['Midnight', 'Carbon', 'Slate'],
      },
      {
        kind: 'slider',
        id: 'accentIntensity',
        label: 'Accent intensity',
        hint: 'Strength of the accent lighting.',
        value: 70,
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
      },
      {
        kind: 'toggle',
        id: 'launchOnStart',
        label: 'Launch on startup',
        hint: 'Open the client when the system boots.',
        value: false,
      },
      {
        kind: 'check',
        id: 'reduceAnimations',
        label: 'Reduce animations',
        hint: 'Minimise motion inside the client.',
        value: false,
      },
    ],
  },
];

/**
 * Hotspots layered over the window. `dot` positions the marker and `rect`
 * is the region lit up on hover — both in percentages of the frame.
 */
export interface LauncherCallout {
  id: string;
  label: string;
  text: string;
  dot: { x: number; y: number };
  rect: { x: number; y: number; w: number; h: number };
  side: 'left' | 'right';
}

export const launcherCallouts: LauncherCallout[] = [
  {
    id: 'nav',
    label: 'Navigation',
    text: 'Switch between your library, delivery and security panes.',
    dot: { x: 11, y: 40 },
    rect: { x: 1.5, y: 12, w: 26, h: 76 },
    side: 'left',
  },
  {
    id: 'controls',
    label: 'Live controls',
    text: 'Toggles, sliders and dropdowns you can actually operate.',
    dot: { x: 64, y: 46 },
    rect: { x: 28, y: 22, w: 70, h: 62 },
    side: 'right',
  },
  {
    id: 'titlebar',
    label: 'Window actions',
    text: 'A real application frame rather than a flat screenshot.',
    dot: { x: 50, y: 5 },
    rect: { x: 1.5, y: 1.5, w: 97, h: 9 },
    side: 'right',
  },
  {
    id: 'status',
    label: 'Session status',
    text: 'Connection state and the node currently serving you.',
    dot: { x: 30, y: 95 },
    rect: { x: 1.5, y: 89, w: 97, h: 9.5 },
    side: 'left',
  },
];

/** Feature cards shown in the FEATURES mode of the showcase. */
export const launcherFeatures = [
  {
    id: 'vault',
    title: 'One library',
    text: 'Every account you own sits in a single searchable list with its current state.',
  },
  {
    id: 'handoff',
    title: 'Guided handoff',
    text: 'The client walks through each credential step by step instead of dumping a text file.',
  },
  {
    id: 'masking',
    title: 'Masked by default',
    text: 'Details stay hidden until you choose to reveal them, and the clipboard clears itself.',
  },
  {
    id: 'sync',
    title: 'Picks a near node',
    text: 'Delivery routes through the region you select for the shortest possible wait.',
  },
];
