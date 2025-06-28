import JSZip from 'jszip';

import { Random, sample, shuffle } from '../random';
import { toU32Buffer } from '../util';
import { Game } from '../config';
import { RomBuilder } from '../rom-builder';
import { Monitor } from '../monitor';
import { LogWriter } from '../util/log-writer';
import { concatUint8Arrays } from 'uint8array-extras';

type MusicType = 'bgm' | 'fanfare';

/* Bankmeta Binary */
enum CachePolicy {
  CACHE_LOAD_PERMANENT,
  CACHE_LOAD_PERSISTENT,
  CACHE_LOAD_TEMPORARY,
  CACHE_LOAD_EITHER,
  CACHE_LOAD_EITHER_NOSYNC,
}

type MusicEntry = {
  songType: MusicType;
  cacheType: CachePolicy;
  name: string;
  oot?: number[];
  mm?: number[];
}

const MUSIC: {[k: string]: MusicEntry} = {
  OOT_FILE_SELECT:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - File Select',                     oot: [0x57] },
  OOT_HYRULE_FIELD:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Hyrule Field',                    oot: [0x02] },
  OOT_DODONGO_CAVERN:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Dodongo Cavern',                  oot: [0x18] },
  OOT_KAKARIKO_ADULT:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Kakariko Adult',                  oot: [0x19] },
  OOT_BATTLE:                           { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Battle',                          oot: [0x1A] },
  OOT_BATTLE_BOSS:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Boss Battle',                     oot: [0x1B] },
  OOT_DEKU_TREE:                        { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Deku Tree',                       oot: [0x1C] },
  OOT_MARKET:                           { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Market',                          oot: [0x1D] },
  OOT_TITLE:                            { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Title Theme',                     oot: [0x1E] },
  OOT_HOUSES:                           { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Houses',                          oot: [0x1F] },
  OOT_JABU_JABU:                        { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Jabu Jabu',                       oot: [0x26] },
  OOT_KAKARIKO_CHILD:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Kakariko Child',                  oot: [0x27] },
  OOT_FAIRY_FOUNTAIN:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Fairy Fountain',                  oot: [0x28] },
  OOT_ZELDA_THEME:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Zelda Theme',                     oot: [0x29] },
  OOT_TEMPLE_FIRE:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Fire Temple',                     oot: [0x2A] },
  OOT_TEMPLE_FOREST:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Forest Temple',                   oot: [0x2C] },
  OOT_CASTLE_COURTYARD:                 { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Castle Courtyard',                oot: [0x2D] },
  OOT_GANONDORF_THEME:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Ganondorf Theme',                 oot: [0x2E] },
  OOT_LON_LON_RANCH:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Lon Lon Ranch',                   oot: [0x2F] },
  OOT_GORON_CITY:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Goron City',                      oot: [0x30] },
  OOT_BATTLE_MINIBOSS:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Miniboss Battle',                 oot: [0x38] },
  OOT_TEMPLE_OF_TIME:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Temple of Time',                  oot: [0x3A] },
  OOT_KOKIRI_FOREST:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Kokiri Forest',                   oot: [0x3C] },
  OOT_LOST_WOODS:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Lost Woods',                      oot: [0x3E] },
  OOT_TEMPLE_SPIRIT:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Spirit Temple',                   oot: [0x3F] },
  OOT_HORSE_RACE:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Horse Race',                      oot: [0x40] },
  OOT_INGO_THEME:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Ingo Theme',                      oot: [0x42] },
  OOT_FAIRY_FLYING:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Fairy Flying',                    oot: [0x4A] },
  OOT_THEME_DEKU_TREE:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Deku Tree Theme',                 oot: [0x4B] },
  OOT_WINDMILL_HUT:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Windmill Hut',                    oot: [0x4C] },
  OOT_SHOOTING_GALLERY:                 { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Shooting Gallery',                oot: [0x4E] },
  OOT_SHEIK_THEME:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Sheik Theme',                     oot: [0x4F] },
  OOT_ZORAS_DOMAIN:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Zoras Domain',                    oot: [0x50] },
  OOT_SHOP:                             { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Shop',                            oot: [0x55] },
  OOT_SAGES:                            { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Chamber of the Sages',            oot: [0x56] },
  OOT_ICE_CAVERN:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Ice Cavern',                      oot: [0x58] },
  OOT_KAEPORA_GAEBORA:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'OoT - Kaepora Gaebora',                 oot: [0x5A] },
  OOT_TEMPLE_SHADOW:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Shadow Temple',                   oot: [0x5B] },
  OOT_TEMPLE_WATER:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Water Temple',                    oot: [0x5C] },
  OOT_GERUDO_VALLEY:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Gerudo Valley',                   oot: [0x5F] },
  OOT_POTION_SHOP:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Potion Shop (OoT)',               oot: [0x60] },
  OOT_KOTAKE_KOUME:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Kotake and Koume',                oot: [0x61] },
  OOT_ESCAPE_CASTLE:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Castle Escape',                   oot: [0x62] },
  OOT_UNDERGROUND_CASTLE:               { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Castle Underground',              oot: [0x63] },
  OOT_BATTLE_GANONDORF:                 { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Ganondorf Battle',                oot: [0x64] },
  OOT_BATTLE_GANON:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Ganon Battle',                    oot: [0x65] },
  OOT_BATTLE_BOSS_FIRE:                 { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Fire Temple Boss',                oot: [0x6B] },
  OOT_MINIGAME:                         { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Minigame',                        oot: [0x6C] },
  OOT_GROTTOS:                          { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Grottos',                         oot: [0x6E] },
  OOT_GRAVES:                           { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Graves',                          oot: [0x6F] },
  OOT_GERUDO_TRAINING_GROUNDS:          { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'OoT - Gerudo Training Grounds',         oot: [0x70] },
  MM_TERMINA_FIELD:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Termina Field',                    mm: [0x02] },
  MM_TEMPLE_STONE_TOWER:                { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Stone Tower Temple',               mm: [0x06] },
  MM_TEMPLE_STONE_TOWER_INVERTED:       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Stone Tower Temple Inverted',      mm: [0x07] },
  MM_SOUTHERN_SWAMP:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Southern Swamp',                   mm: [0x0C] },
  MM_ALIENS:                            { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Aliens',                           mm: [0x0D] },
  MM_MINIGAME:                          { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Minigame',                         mm: [0x0E] },
  MM_SHARP_CURSE:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Sharp Curse',                      mm: [0x0F] },
  MM_GREAT_BAY_COAST:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Great Bay Coast',                  mm: [0x10] },
  MM_IKANA_VALLEY:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Ikana Valley',                     mm: [0x11] },
  MM_COURT_DEKU_KING:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Court of the Deku King',           mm: [0x12] },
  MM_MOUNTAIN_VILLAGE:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Mountain Village',                 mm: [0x13] },
  MM_PIRATES_FORTRESS:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Pirates Fortress',                 mm: [0x14] },
  MM_CLOCK_TOWN_DAY_1:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Clock Town Day 1',                 mm: [0x15, 0x1D] },
  MM_CLOCK_TOWN_DAY_2:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Clock Town Day 2',                 mm: [0x16, 0x23] },
  MM_CLOCK_TOWN_DAY_3:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Clock Town Day 3',                 mm: [0x17] },
  MM_BATTLE_BOSS:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Boss Battle',                      mm: [0x1B] },
  MM_WOODFALL_TEMPLE:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Woodfall Temple',                  mm: [0x1C] },
  MM_STOCK_POT_INN:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Stock Pot Inn',                    mm: [0x1F] },
  MM_MINIGAME2:                         { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Minigame 2',                       mm: [0x25] },
  MM_GORON_RACE:                        { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Goron Race',                       mm: [0x26] },
  MM_MUSIC_BOX_HOUSE:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Music Box House',                  mm: [0x27] },
  MM_FAIRYS_FOUNTAIN:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Fairy\'s Fountain',                mm: [0x28] /* 0x18 = File Select */ },
  MM_MARINE_RESEARCH_LABORATORY:        { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Marine Research Laboratory',       mm: [0x2C] },
  MM_ROMANI_RANCH:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Romani Ranch',                     mm: [0x2F] },
  MM_GORON_VILLAGE:                     { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Goron Village',                    mm: [0x30] },
  MM_MAYOR_DOTOUR:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Mayor Dotour',                     mm: [0x31] },
  MM_ZORA_HALL:                         { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Zora Hall',                        mm: [0x36] },
  MM_MINIBOSS:                          { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Mini Boss',                        mm: [0x38] },
  MM_ASTRAL_OBSERVATORY:                { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Astral Observatory',               mm: [0x3A] },
  MM_BOMBERS_HIDEOUT:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Bombers Hideout',                  mm: [0x3B] },
  MM_MILK_BAR:                          { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Milk Bar',                         mm: [0x3C, 0x56] },
  MM_WOODS_OF_MYSTERY:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Woods of Mystery',                 mm: [0x3E] },
  MM_GORMAN_RACE:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Gorman Race',                      mm: [0x40] },
  MM_GORMAN_BROS:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Gorman Bros.',                     mm: [0x42] },
  MM_KOTAKE_POTION_SHOP:                { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Kotake\'s Potion Shop',            mm: [0x43] },
  MM_STORE:                             { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Store',                            mm: [0x44] },
  MM_TARGET_PRACTICE:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Target Practice',                  mm: [0x46] },
  MM_SWORD_TRAINING:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Sword Training',                   mm: [0x50] },
  MM_FINAL_HOURS:                       { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Final Hours',                      mm: [0x57, 0x60] /* 0x60 = Majora's Boss Room (Pointer: 0x57) */ },
  MM_TEMPLE_SNOWHEAD:                   { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Snowhead Temple',                  mm: [0x65] },
  MM_TEMPLE_GREAT_BAY:                  { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Great Bay Temple',                 mm: [0x66] },
  MM_BATTLE_MAJORA3:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Majora\'s Wrath',                  mm: [0x69] },
  MM_BATTLE_MAJORA2:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Majora\'s Incarnation',            mm: [0x6A] },
  MM_BATTLE_MAJORA1:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Majora\'s Mask',                   mm: [0x6B] },
  MM_IKANA_CASTLE:                      { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Ikana Castle',                     mm: [0x6F] },
  MM_CLEAR_WOODFALL:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Woodfall Clear',                   mm: [0x78] },
  MM_CLEAR_SNOWHEAD:                    { songType: 'bgm',     cacheType: CachePolicy.CACHE_LOAD_TEMPORARY,  name: 'MM - Snowhead Clear',                   mm: [0x79] },
  FANFARE_SHARED_ITEM_MAJOR:            { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Major',           oot: [0x22], mm: [0x22] },
  FANFARE_SHARED_ITEM_HEART_PIECE:      { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Heart Piece',     oot: [0x39], mm: [0x39] },
  FANFARE_SHARED_ITEM_HEART_CONTAINER:  { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Heart Container', oot: [0x24], mm: [0x24] },
  FANFARE_SHARED_ITEM_MASK:             { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Mask',            oot: [],     mm: [0x37] },
  FANFARE_SHARED_ITEM_STONE:            { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Stone',           oot: [0x32], mm: [] },
  FANFARE_SHARED_ITEM_MEDALLION:        { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Medallion',       oot: [0x43], mm: [] },
  FANFARE_SHARED_ITEM_OCARINA:          { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'Shared - Fanfare Item Ocarina',         oot: [0x3D], mm: [0x52] },
  FANFARE_OOT_GAME_OVER:                { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'OoT - Fanfare Game Over',               oot: [0x20] },
  FANFARE_OOT_BOSS_CLEAR:               { songType: 'fanfare', cacheType: CachePolicy.CACHE_LOAD_PERSISTENT, name: 'OoT - Fanfare Boss Clear',              oot: [0x21] },
};

type MusicFile = {
  songType: 'bgm' | 'fanfare';
  seq: Uint8Array;
  bankIdOot: number | null;
  bankIdMm: number | null;
  bankCustom: { meta: Uint8Array, data: Uint8Array } | null;
  filename: string;
  name: string;
  games: Game[];
};

const DIACRITICS_BASES = {
  'á': 'a',
  'à': 'a',
  'â': 'a',
  'ä': 'a',
  'Á': 'A',
  'À': 'A',
  'Â': 'A',
  'Ä': 'A',
  'é': 'e',
  'è': 'e',
  'ê': 'e',
  'ë': 'e',
  'É': 'E',
  'È': 'E',
  'Ê': 'E',
  'Ë': 'E',
  'í': 'i',
  'ì': 'i',
  'î': 'i',
  'ï': 'i',
  'Í': 'I',
  'Ì': 'I',
  'Î': 'I',
  'Ï': 'I',
  'ó': 'o',
  'ò': 'o',
  'ô': 'o',
  'ö': 'o',
  'Ó': 'O',
  'Ò': 'O',
  'Ô': 'O',
  'Ö': 'O',
  'ú': 'u',
  'ù': 'u',
  'û': 'u',
  'ü': 'u',
  'Ú': 'U',
  'Ù': 'U',
  'Û': 'U',
  'Ü': 'U',
  'ý': 'y',
  'ÿ': 'y',
  'Ý': 'Y',
  'Ÿ': 'Y',
  'ç': 'c',
  'Ç': 'C',
  'ñ': 'n',
  'Ñ': 'N',
  'æ': 'ae',
  'Æ': 'AE',
  'œ': 'oe',
  'Œ': 'OE',
};

function saneName(name: string) {
  /* Force NFC */
  name = name.normalize('NFC');

  /* Remove diacritics */
  for (const [base, repl] of Object.entries(DIACRITICS_BASES)) {
    name = name.replaceAll(base, repl);
  }

  /* Remove every other non-ascii */
  name = name.replace(/[^ -~]/g, '');

  return name;
}

function isMusicSuitable(entry: MusicEntry, file: MusicFile) {
  if (entry.songType !== file.songType) return false;
  if (entry.oot !== undefined && !file.games.includes('oot')) return false;
  if (entry.mm !== undefined && !file.games.includes('mm')) return false;

  return true;
}

function mmrSampleBank(sb: number) {
  if (sb === 0xff) {
    return 0xff;
  }
  return sb + 8;
}

class MusicInjector {
  private musics: MusicFile[];
  private namesBuffer: Uint8Array;
  private bankId: number;

  constructor(
    private writer: LogWriter,
    private monitor: Monitor,
    private builder: RomBuilder,
    private random: Random,
    private musicZipData: Uint8Array,
  ) {
    this.musics = [];
    this.namesBuffer = new Uint8Array(256 * 2 * 48);
    this.bankId = 0x60;
  }

  private isMaxBank() {
    return this.bankId >= 0xf0;
  }

  private addCustomBank(meta: Uint8Array, data: Uint8Array) {
    const bankId = this.bankId++;
    const dataVrom = this.appendAudio(data);
    const dataSize = data.length;
    const prefix = toU32Buffer([dataVrom, dataSize]);
    const fullmeta = concatUint8Arrays([prefix, meta]);
    const customFile = this.builder.fileByNameRequired('custom/bank_table');
    const offset = (bankId - 0x60) * 0x10;
    customFile.data.set(fullmeta, offset);
    return bankId;
  }

  private registerName(seqId: number, name: string) {
    /* Cut name to 48 characters */
    name = name.slice(0, 48);

    /* Write to buffer */
    const offset = seqId * 48;
    const nameEncoded = new TextEncoder().encode(name);
    this.namesBuffer.set(nameEncoded, offset);
  }

  private async loadMusicsOotrs(files: JSZip.JSZipObject[]) {
    for (const f of files) {
      /* Get the music zip */
      const musicZipBuffer = await f.async('uint8array');
      let musicZip: JSZip;
      try {
        musicZip = await JSZip.loadAsync(musicZipBuffer);
      } catch (e) {
        this.monitor.warn(`Skipped music file ${f.name}: invalid zip file`);
        continue;
      }

      /* Look for custom bank data */
      const filesBank = musicZip.file(/\.z?bank$/);
      if (filesBank.length > 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple bank files`);
        continue;
      }
      const filesBankmeta = musicZip.file(/\.z?bankmeta$/);
      if (filesBankmeta.length > 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple bankmeta files`);
        continue;
      }

      if (filesBank.length !== filesBankmeta.length) {
        this.monitor.warn(`Skipped music file ${f.name}: bank and bankmeta mismatch`);
        continue;
      }

      const badFiles = musicZip.file(/\.z?sound$/);
      if (badFiles.length > 0) {
        this.monitor.warn(`Skipped music file ${f.name}: unsupported files found`);
        continue;
      }

      /* Find the meta file */
      const metaFile = musicZip.file(/\.meta$/);
      if (metaFile.length !== 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple metadata files`);
        continue;
      }

      /* Find the seq file */
      const seqFiles = musicZip.file(/\.seq$/);
      if (seqFiles.length !== 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple sequence files`);
        continue;
      }

      /* Parse the metadata */
      const metaRaw = await metaFile[0].async('text');
      const meta = metaRaw.split(/\r?\n/);
      if (meta.length < 3) {
        this.monitor.warn(`Skipped music file ${f.name}: metadata must have at least 3 lines`);
        continue;
      }
      const filename = f.name.split('/').pop()!;
      const name = saneName(meta[0]);
      let songType = meta[2].toLowerCase();
      const games: Game[] = ['oot'];
      if (songType === 'f') {
        songType = 'fanfare';
      }
      if (songType !== 'bgm' && songType !== 'fanfare') {
        this.monitor.warn(`Skipped music file ${f.name}: unknown type ${songType}`);
        continue;
      }

      let bankCustom: { meta: Uint8Array, data: Uint8Array } | null = null;
      let bankIdOot: number | null = null;
      let bankIdMm: number | null = null;

      if (filesBank.length) {
        const bank = await filesBank[0].async('uint8array');
        const bankmeta = await filesBankmeta[0].async('uint8array');
        if (bankmeta.length !== 0x08) {
          this.monitor.warn(`Skipped music file ${f.name}: invalid bankmeta length`);
          continue;
        }

        bankCustom = { meta: bankmeta, data: bank };
        games.push('mm');
      } else {
        bankIdOot = Number(meta[1]);
        if (bankIdOot >= 2) {
          bankIdMm = bankIdOot + 0x30;
          games.push('mm');
        }
      }

      /* Add the music */
      const seq = await seqFiles[0].async('uint8array');
      const music: MusicFile = { songType, seq, bankIdOot, bankIdMm, bankCustom, filename, name, games };
      this.musics.push(music);
    }
  }

  private async loadMusicsMmrs(files: JSZip.JSZipObject[]) {
    for (const f of files) {
      /* Get the music zip */
      const musicZipBuffer = await f.async('uint8array');
      let musicZip: JSZip;
      try {
        musicZip = await JSZip.loadAsync(musicZipBuffer);
      } catch (e) {
        this.monitor.warn(`Skipped music file ${f.name}: invalid zip file`);
        continue;
      }

      /* Look for custom bank data */
      const filesBank = musicZip.file(/\.z?bank$/);
      if (filesBank.length > 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple bank files`);
        continue;
      }
      const filesBankmeta = musicZip.file(/\.z?bankmeta$/);
      if (filesBankmeta.length > 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple bankmeta files`);
        continue;
      }

      if (filesBank.length !== filesBankmeta.length) {
        this.monitor.warn(`Skipped music file ${f.name}: bank and bankmeta mismatch`);
        continue;
      }

      const badFiles = musicZip.file(/\.z?sound$/);
      if (badFiles.length > 0) {
        this.monitor.warn(`Skipped music file ${f.name}: unsupported files found`);
        continue;
      }

      /* Find the zseq file */
      const zseqFiles = musicZip.file(/\.zseq$/);
      if (zseqFiles.length !== 1) {
        this.monitor.warn(`Skipped music file ${f.name}: multiple sequence files`);
        continue;
      }

      /* Get the categories.txt file */
      const categoriesTxt = musicZip.file('categories.txt');
      if (!categoriesTxt) {
        this.monitor.warn(`Skipped music file ${f.name}: categories.txt not found`);
        continue;
      }
      const categoriesData = await categoriesTxt.async('text');
      const categories = categoriesData.split(/[,-]/).map(x => x.trim());

      /* Extract the bank ID from the zseq filename */
      let zseqFilename = zseqFiles[0].name;
      if (zseqFilename.includes('/')) {
        zseqFilename = zseqFilename.split('/').pop()!;
      }
      const bankIdRaw = zseqFilename.split('.')[0];

      /* Add the music */
      const seq = await zseqFiles[0].async('uint8array');
      const games: Game[] = ['mm'];
      let songType: MusicType;
      if (['8', '9', '10'].some(x => categories.includes(x))) {
        songType = 'fanfare';
      } else {
        songType = 'bgm';
      }
      const filename = f.name.split('/').pop()!;
      const name = saneName(filename.replace('.mmrs', ''));

      let bankCustom: { meta: Uint8Array, data: Uint8Array } | null = null;
      let bankIdOot: number | null = null;
      let bankIdMm: number | null = null;

      if (filesBank.length) {
        const bank = await filesBank[0].async('uint8array');
        const bankmeta = await filesBankmeta[0].async('uint8array');
        if (bankmeta.length !== 0x08) {
          this.monitor.warn(`Skipped music file ${f.name}: invalid bankmeta length`);
          continue;
        }

        const sampleBank1 = mmrSampleBank(bankmeta[0x02]);
        const sampleBank2 = mmrSampleBank(bankmeta[0x03]);
        const sampleBanks = new Uint8Array([sampleBank1, sampleBank2]);
        bankmeta.set(sampleBanks, 0x02);
        bankCustom = { meta: bankmeta, data: bank };
        games.push('oot');
      } else {
        bankIdMm = parseInt(bankIdRaw, 16);
        if (bankIdMm >= 2) {
          bankIdOot = bankIdMm + 0x30;
          games.push('oot');
        }
      }

      const music: MusicFile = { songType, seq, bankIdOot, bankIdMm, bankCustom, filename, name, games };
      this.musics.push(music);
    }
  }

  private async loadMusics(data: Uint8Array) {
    const zip = await JSZip.loadAsync(data);
    await this.loadMusicsOotrs(zip.file(/\.ootrs$/));
    await this.loadMusicsMmrs(zip.file(/\.mmrs$/));
  }

  private appendAudio(seq: Uint8Array) {
    const vrom = this.builder.addFile({ game: 'custom', type: 'uncompressed', data: seq })!;
    return vrom;
  }

  private async injectMusicMeta(game: Game, slot: number, vrom: number, seqLength: number, bankId: number, name: string) {
    const fileSeqTable = this.builder.fileByNameRequired(`${game}/seq_table`);
    const fileSeqBanks = this.builder.fileByNameRequired(`${game}/seq_banks`);

    /* Patch the bank ID */
    fileSeqBanks.data[slot] = bankId;

    /* Add the pointer */
    const seqTableData = toU32Buffer([vrom, seqLength]);
    fileSeqTable.data.set(seqTableData, slot * 0x10);

    /* Register the name */
    this.registerName(game === 'mm' ? slot + 256 : slot, name);
  }

  private async injectMusic(slot: string, music: MusicFile) {
    const entry = MUSIC[slot];
    const vrom = this.appendAudio(music.seq);
    let customBankId: number | null = null;

    if (music.bankCustom) {
      /* Ensure the bankmeta always has the correct cache type */
      music.bankCustom.meta[1] = entry.cacheType;

      customBankId = this.addCustomBank(music.bankCustom.meta, music.bankCustom.data);
    }

    for (const id of entry.oot || []) {
      await this.injectMusicMeta('oot', id, vrom, music.seq.length, customBankId || music.bankIdOot!, music.name);
    }

    for (const id of entry.mm || []) {
      await this.injectMusicMeta('mm', id, vrom, music.seq.length, customBankId || music.bankIdMm!, music.name);
    }
  }

  private patchOot() {
    /* Disable battle music */
    const filePlayerActor = this.builder.fileByNameRequired('oot/ovl_player_actor');
    filePlayerActor.data[0x1690f] = 0;
  }

  private patchMm() {
    /* Disable battle music */
    const filePlayerActor = this.builder.fileByNameRequired('mm/ovl_player_actor');
    filePlayerActor.data[0x16818] = 0x10;
    filePlayerActor.data[0x16819] = 0x00;
  }

  private async shuffleMusics() {
    const slots = shuffle(this.random, Object.keys(MUSIC));
    const musics = new Set(this.musics);
    let musics_name = new Array();

    this.writer.indent('Music');
    for (;;) {
      if (musics.size === 0 || slots.length === 0) {
        break;
      }

      const slot = slots.pop()!;
      let candidates = Array.from(musics).filter(x => isMusicSuitable(MUSIC[slot], x));
      if (this.isMaxBank()) {
        candidates = candidates.filter(x => x.bankCustom === null);
      }

      if (candidates.length === 0) {
        continue;
      }

      const music = sample(this.random, candidates);
      musics.delete(music);
      await this.injectMusic(slot, music);
      const entry = MUSIC[slot];
      musics_name.push(`${entry.name}: ${music.name} (${music.filename})`);
    }
    for(let entry of musics_name.sort()) {
      this.writer.write(entry);
    }
    this.writer.unindent();
  }

  async run() {
    /* Extract the list of musics */
    await this.loadMusics(this.musicZipData);

    /* Shuffle musics */
    await this.shuffleMusics();

    /* Run misc. patches */
    this.patchOot();
    this.patchMm();

    /* Inject the music names */
    this.builder.addFile({ game: 'custom', type: 'uncompressed', vaddr: 0xf1000000, data: this.namesBuffer });
  }
}

export async function randomizeMusic(writer: LogWriter, monitor: Monitor, builder: RomBuilder, random: Random, data: Uint8Array) {
  const injector = new MusicInjector(writer, monitor, builder, random, data);
  await injector.run();
}
