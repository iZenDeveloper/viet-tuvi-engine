# Tradition Profiles

`vietnamese` is the implemented baseline and is versioned as `vn-popular-0.2`.
`trung-chau` and `custom` are accepted API profile names for forward
compatibility, but currently use the Vietnamese baseline and emit a warning.

A real profile must provide versioned rule tables for:

- palace orientation and Mệnh/Thân conventions;
- Cục and Na Yin mapping;
- Tứ Hóa and Phi Hóa;
- auxiliary-star placement;
- Đại/Tiểu/Lưu timeline direction;
- conformance fixtures from an authoritative source.

The engine should not claim Trung Châu conformance until those tables and
fixtures are supplied. This is the remaining manual domain decision before a
multi-tradition `1.0` release.
