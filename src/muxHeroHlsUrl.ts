/** 与 Mux 资产 Playback ID 一致；修改资产时只改此处 */
export const MUX_PLAYBACK_ID = "Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g";

/**
 * 头图 Mux HLS 地址（与 {@link HeroMuxBackground} 一致）。
 * @see https://docs.mux.com/guides/control-playback-resolution
 */
export const MUX_HERO_HLS_URL = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8?min_resolution=1080p&rendition_order=desc`;
