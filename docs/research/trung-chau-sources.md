# Trung Châu Research Sources

Research captured 2026-07-26. These sources are references for rule comparison,
not an assertion that every online implementation is authoritative.

## Primary technical reference candidate

**Tử Vi Bắc Phái / Trung Châu calculator**  
<https://tuvibacphai.com/tuvi>

The page labels its calculator “An sao Trung Châu Lý Số” and exposes selectable
profiles/options including:

- `TCP` and `VDTTL` star-placement modes;
- Tứ Hóa;
- Phi Hóa;
- Thái Tuế, Bác Sĩ, Tướng Tinh;
- ten-year, annual, monthly, daily, and hourly limits.

The page loads public JavaScript assets such as `bacot.js` and
`tutrufunction.js`. The visible source includes a ten-stem transformation table
and a 60-pair Na Yin table. It is useful as an executable comparison oracle,
but its license, provenance, and exact meaning of the `TCP`/`VDTTL` profiles
are not established. Do not copy code into the engine.

The visible transformation labels are:

| Can | Lộc | Quyền | Khoa | Kỵ |
|---|---|---|---|---|
| Giáp | Liêm Trinh | Phá Quân | Vũ Khúc | Thái Dương |
| Ất | Thiên Cơ | Thiên Lương | Tử Vi | Thái Âm |
| Bính | Thiên Đồng | Thiên Cơ | Văn Xương | Liêm Trinh |
| Đinh | Thái Âm | Thiên Đồng | Thiên Cơ | Cự Môn |
| Mậu | Tham Lang | Thái Âm | Hữu Bật | Thiên Cơ |
| Kỷ | Vũ Khúc | Tham Lang | Thiên Lương | Văn Khúc |
| Canh | Thái Dương | Vũ Khúc | Thái Âm | Thiên Đồng |
| Tân | Cự Môn | Thái Dương | Văn Khúc | Văn Xương |
| Nhâm | Thiên Lương | Tử Vi | Tả Phù | Vũ Khúc |
| Quý | Phá Quân | Cự Môn | Thái Âm | Tham Lang |

This agrees with the engine's current natal transformation table. It is
recorded as a cross-check, not as proof that every Trung Châu branch uses the
same table.

## Historical/academic context

**Tử Vi Việt Nam: Sơ lược về lịch sử Tử Vi Trung Hoa và Trung Châu Phái**  
<https://tuvivietnam.vn/so-luoc-ve-lich-su-tu-vi-trung-hoa-noi-chung-va-trung-chau-phai-noi-rieng/>

The article identifies Nguyễn Anh Vũ's Vietnamese translation of Vương Đình
Chi's *Trung Châu Tử Vi Đẩu Số Tam Hợp Phái* as a commonly circulated reference
and gives historical context for the name “Trung Châu”. This is contextual
material, not a machine-readable rule specification.

**Tử Vi Việt Nam: Trung Châu Phái tạp diệu luận**  
<https://tuvivietnam.vn/trung-chau-phai/>

This article provides examples of Trung Châu interpretations for auxiliary
stars and star combinations, including Thiên Thương/Thiên Sứ and
Thiên Hình/Thiên Diêu. It is useful for future interpretation facts, but it
does not constitute a complete an-sao table.

## Modern school site and bibliography

**Tử Vi Trung Châu — Trường Phái Trung Châu**  
<https://tuvitrungchau.com>

The site identifies works including *Đẩu Số Giảng Nghĩa*, *An Tinh Pháp Cập
Suy Đoán Thực Lệ*, and *Thâm Tạo Giảng Nghĩa*, and describes a 60-star-system
approach plus a school-specific Tứ Hóa system. The site is a school/promotional
source; use it to identify bibliography and terminology, not as independent
validation.

**Tiki listing: Trung Châu Tử Vi Đẩu Số - Tứ Hóa Phái**  
<https://tiki.vn/>

Search results identify a two-volume Vietnamese edition associated with Vương
Đình Chi and Nguyễn Anh Vũ. The actual book text is copyrighted and was not
copied or ingested.

## Engineering conclusion

The public evidence supports a separate Trung Châu profile with at least:

1. a profile-specific an-sao switch (`TCP` versus other conventions);
2. a school-specific Tứ Hóa/Phi Hóa rule table;
3. 60 tinh hệ metadata for interpretation;
4. profile-specific fixtures generated from cited example charts.

The current engine therefore keeps `trung-chau` as a Vietnamese-baseline
fallback with a warning. Implementing it as a claimed conformance profile
requires a licensed/approved rule table or user-supplied fixtures from the
chosen edition.
