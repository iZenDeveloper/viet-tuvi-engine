(module
 (type $0 (func (param i32 f64) (result i32)))
 (type $1 (func (param f64) (result f64)))
 (type $2 (func (param i32) (result f64)))
 (type $3 (func (result i32)))
 (type $4 (func (param i32 i32 i32) (result i32)))
 (type $5 (func (param i64) (result i32)))
 (type $6 (func (param i32 i32 i32 f64) (result i64)))
 (global $~lib/math/rempio2_y0 (mut f64) (f64.const 0))
 (global $~lib/math/rempio2_y1 (mut f64) (f64.const 0))
 (global $~lib/math/res128_hi (mut i64) (i64.const 0))
 (memory $0 1)
 (data $0 (i32.const 1024) "n\83\f9\a2\00\00\00\00\d1W\'\fc)\15DN\99\95b\db\c0\dd4\f5\abcQ\feA\90C<:n$\b7a\c5\bb\de\ea.I\06\e0\d2MB\1c\eb\1d\fe\1c\92\d1\t\f55\82\e8>\a7)\b1&p\9c\e9\84D\bb.9\d6\919A~_\b4\8b_\84\9c\f49S\83\ff\97\f8\1f;(\f9\bd\8b\11/\ef\0f\98\05\de\cf~6m\1fm\nZf?FO\b7\t\cb\'\c7\ba\'u-\ea_\9e\f79\07={\f1\e5\eb\b1_\fbk\ea\92R\8aF0\03V\08]\8d\1f \bc\cf\f0\abk{\fca\91\e3\a9\1d6\f4\9a_\85\99e\08\1b\e6^\80\d8\ff\8d@h\a0\14W\15\06\061\'sM")
 (export "abiVersion" (func $assembly/calendar/abiVersion))
 (export "julianDay" (func $assembly/calendar/julianDay))
 (export "solarToLunarPacked" (func $assembly/calendar/solarToLunarPacked))
 (export "equationOfTimeMinutes" (func $assembly/calendar/equationOfTimeMinutes))
 (export "memory" (memory $0))
 (func $assembly/calendar/abiVersion (result i32)
  i32.const 1
 )
 (func $assembly/calendar/julianDay (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $2
  i32.const 4800
  i32.add
  i32.const 14
  local.get $1
  i32.sub
  i32.const 12
  i32.div_s
  local.tee $3
  i32.sub
  local.set $2
  local.get $0
  local.get $1
  local.get $3
  i32.const 12
  i32.mul
  i32.add
  i32.const 153
  i32.mul
  i32.const 457
  i32.sub
  i32.const 5
  i32.div_s
  i32.add
  local.get $2
  i32.const 365
  i32.mul
  i32.add
  local.get $2
  i32.const 4
  i32.div_s
  i32.add
  local.tee $0
  local.get $2
  i32.const 100
  i32.div_s
  i32.sub
  local.get $2
  i32.const 400
  i32.div_s
  i32.add
  i32.const 32045
  i32.sub
  local.tee $1
  i32.const 2299161
  i32.lt_s
  if (result i32)
   local.get $0
   i32.const 32083
   i32.sub
  else
   local.get $1
  end
 )
 (func $~lib/math/pio2_large_quot (param $0 i64) (result i32)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i32)
  (local $5 f64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  local.get $0
  i64.const 9223372036854775807
  i64.and
  i64.const 52
  i64.shr_u
  i64.const 1045
  i64.sub
  local.tee $1
  i64.const 63
  i64.and
  local.set $6
  local.get $1
  i64.const 6
  i64.shr_s
  i32.wrap_i64
  i32.const 3
  i32.shl
  i32.const 1024
  i32.add
  local.tee $4
  i64.load
  local.set $3
  local.get $4
  i64.load offset=8
  local.set $2
  local.get $4
  i64.load offset=16
  local.set $1
  local.get $6
  i64.const 0
  i64.ne
  if
   local.get $3
   local.get $6
   i64.shl
   local.get $2
   i64.const 64
   local.get $6
   i64.sub
   local.tee $7
   i64.shr_u
   i64.or
   local.set $3
   local.get $2
   local.get $6
   i64.shl
   local.get $1
   local.get $7
   i64.shr_u
   i64.or
   local.set $2
   local.get $1
   local.get $6
   i64.shl
   local.get $4
   i64.load offset=24
   local.get $7
   i64.shr_u
   i64.or
   local.set $1
  end
  local.get $0
  i64.const 4503599627370495
  i64.and
  i64.const 4503599627370496
  i64.or
  local.tee $6
  i64.const 4294967295
  i64.and
  local.set $7
  local.get $2
  i64.const 4294967295
  i64.and
  local.tee $8
  local.get $6
  i64.const 32
  i64.shr_u
  local.tee $9
  i64.mul
  local.get $2
  i64.const 32
  i64.shr_u
  local.tee $2
  local.get $7
  i64.mul
  local.get $7
  local.get $8
  i64.mul
  local.tee $7
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $8
  i64.const 4294967295
  i64.and
  i64.add
  local.set $10
  local.get $2
  local.get $9
  i64.mul
  local.get $8
  i64.const 32
  i64.shr_u
  i64.add
  local.get $10
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  local.get $1
  i64.const 32
  i64.shr_u
  i64.mul
  local.tee $1
  local.get $7
  i64.const 4294967295
  i64.and
  local.get $10
  i64.const 32
  i64.shl
  i64.add
  i64.add
  local.tee $2
  local.get $1
  i64.lt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.get $3
  local.get $6
  i64.mul
  i64.add
  i64.add
  local.tee $3
  i64.const 2
  i64.shl
  local.get $2
  i64.const 62
  i64.shr_u
  i64.or
  local.tee $6
  i64.const 63
  i64.shr_s
  local.tee $7
  local.get $2
  i64.const 2
  i64.shl
  i64.xor
  local.set $2
  local.get $6
  local.get $7
  i64.const 1
  i64.shr_s
  i64.xor
  local.tee $1
  i64.clz
  local.set $8
  local.get $1
  local.get $8
  i64.shl
  local.get $2
  i64.const 64
  local.get $8
  i64.sub
  i64.shr_u
  i64.or
  local.tee $9
  i64.const 4294967295
  i64.and
  local.set $1
  local.get $9
  i64.const 32
  i64.shr_u
  local.tee $10
  i64.const 560513588
  i64.mul
  local.get $1
  i64.const 3373259426
  i64.mul
  local.get $1
  i64.const 560513588
  i64.mul
  local.tee $11
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $12
  i64.const 4294967295
  i64.and
  i64.add
  local.set $1
  local.get $10
  i64.const 3373259426
  i64.mul
  local.get $12
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  f64.convert_i64_u
  f64.const 3.753184150245214e-04
  f64.mul
  local.get $2
  local.get $8
  i64.shl
  f64.convert_i64_u
  f64.const 3.834951969714103e-04
  f64.mul
  f64.add
  i64.trunc_sat_f64_u
  local.tee $2
  local.get $11
  i64.const 4294967295
  i64.and
  local.get $1
  i64.const 32
  i64.shl
  i64.add
  local.tee $1
  i64.gt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.tee $9
  i64.const 11
  i64.shr_u
  i64.add
  f64.convert_i64_u
  global.set $~lib/math/rempio2_y0
  local.get $9
  i64.const 53
  i64.shl
  local.get $1
  i64.const 11
  i64.shr_u
  i64.or
  local.get $2
  i64.add
  f64.convert_i64_u
  f64.const 5.421010862427522e-20
  f64.mul
  global.set $~lib/math/rempio2_y1
  global.get $~lib/math/rempio2_y0
  i64.const 4372995238176751616
  local.get $8
  i64.const 52
  i64.shl
  i64.sub
  local.get $0
  local.get $6
  i64.xor
  i64.const -9223372036854775808
  i64.and
  i64.or
  f64.reinterpret_i64
  local.tee $5
  f64.mul
  global.set $~lib/math/rempio2_y0
  global.get $~lib/math/rempio2_y1
  local.get $5
  f64.mul
  global.set $~lib/math/rempio2_y1
  local.get $3
  i64.const 62
  i64.shr_s
  local.get $7
  i64.sub
  i32.wrap_i64
 )
 (func $~lib/math/NativeMath.sin (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i64)
  (local $5 i32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $4
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 31
  i32.shr_u
  local.set $3
  local.get $5
  i32.const 2147483647
  i32.and
  local.tee $5
  i32.const 1072243195
  i32.le_u
  if
   local.get $5
   i32.const 1045430272
   i32.lt_u
   if
    local.get $0
    return
   end
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $0
   f64.mul
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $1
   local.get $1
   local.get $1
   f64.mul
   f64.mul
   local.get $1
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.const -0.16666666666666632
   f64.add
   f64.mul
   f64.add
   return
  end
  local.get $5
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.0 (result i32)
   local.get $4
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $5
   i32.const 1094263291
   i32.lt_u
   if
    local.get $5
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $6
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $6
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $6
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $6
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $6
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $6
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $6
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.0
   end
   i32.const 0
   local.get $4
   call $~lib/math/pio2_large_quot
   local.tee $5
   i32.sub
   local.get $5
   local.get $3
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $0
  global.get $~lib/math/rempio2_y1
  local.set $2
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   local.set $6
   f64.const 1
   local.get $1
   f64.const 0.5
   f64.mul
   local.tee $7
   f64.sub
   local.tee $8
   f64.const 1
   local.get $8
   f64.sub
   local.get $7
   f64.sub
   local.get $1
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $6
   local.get $6
   f64.mul
   local.get $1
   local.get $1
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   local.get $2
   f64.mul
   f64.sub
   f64.add
   f64.add
  else
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $0
   f64.mul
   local.set $6
   local.get $0
   local.get $1
   local.get $2
   f64.const 0.5
   f64.mul
   local.get $6
   local.get $1
   local.get $1
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $1
   local.get $1
   local.get $1
   f64.mul
   f64.mul
   local.get $1
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $2
   f64.sub
   local.get $6
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 2
  i32.and
  select
 )
 (func $assembly/calendar/newMoon (param $0 i32) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  local.get $0
  f64.convert_i32_s
  f64.const 1236.85
  f64.div
  local.tee $1
  local.get $1
  f64.mul
  local.tee $2
  local.get $1
  f64.mul
  local.set $5
  local.get $0
  f64.convert_i32_s
  f64.const 385.81691806
  f64.mul
  f64.const 306.0253
  f64.add
  local.get $2
  f64.const 0.0107306
  f64.mul
  f64.add
  local.get $5
  f64.const 0.00001236
  f64.mul
  f64.add
  local.tee $3
  local.get $3
  f64.add
  local.set $7
  local.get $0
  f64.convert_i32_s
  f64.const 29.53058868
  f64.mul
  f64.const 2415020.75933
  f64.add
  local.get $2
  f64.const 0.0001178
  f64.mul
  f64.add
  local.get $5
  f64.const 1.55e-07
  f64.mul
  f64.sub
  local.get $1
  f64.const 132.87
  f64.mul
  f64.const 166.56
  f64.add
  local.get $2
  f64.const 0.009173
  f64.mul
  f64.sub
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.00033
  f64.mul
  f64.add
  f64.const 0.1734
  local.get $1
  f64.const 0.000393
  f64.mul
  f64.sub
  local.get $0
  f64.convert_i32_s
  f64.const 29.10535608
  f64.mul
  f64.const 359.2242
  f64.add
  local.get $2
  f64.const 0.0000333
  f64.mul
  f64.sub
  local.get $5
  f64.const 3.47e-06
  f64.mul
  f64.sub
  local.tee $4
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.mul
  local.get $4
  local.get $4
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0021
  f64.mul
  f64.add
  local.get $3
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.4068
  f64.mul
  f64.sub
  local.get $7
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0161
  f64.mul
  f64.add
  local.get $3
  f64.const 3
  f64.mul
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0004
  f64.mul
  f64.sub
  local.get $0
  f64.convert_i32_s
  f64.const 390.67050646
  f64.mul
  f64.const 21.2964
  f64.add
  local.get $2
  f64.const 0.0016528
  f64.mul
  f64.sub
  local.get $5
  f64.const 2.39e-06
  f64.mul
  f64.sub
  f64.const 2
  f64.mul
  local.tee $6
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0104
  f64.mul
  f64.add
  local.get $4
  local.get $3
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0051
  f64.mul
  f64.sub
  local.get $4
  local.get $3
  f64.sub
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0074
  f64.mul
  f64.sub
  local.get $6
  local.get $4
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0004
  f64.mul
  f64.add
  local.get $6
  local.get $4
  f64.sub
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0004
  f64.mul
  f64.sub
  local.get $6
  local.get $3
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0006
  f64.mul
  f64.sub
  local.get $6
  local.get $3
  f64.sub
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.001
  f64.mul
  f64.add
  local.get $7
  local.get $4
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.0005
  f64.mul
  f64.add
  f64.add
  local.get $1
  f64.const -11
  f64.lt
  if (result f64)
   local.get $1
   f64.const 0.000839
   f64.mul
   f64.const 0.001
   f64.add
   local.get $2
   f64.const 0.0002261
   f64.mul
   f64.add
   local.get $5
   f64.const 8.45e-06
   f64.mul
   f64.sub
   local.get $1
   f64.const 8.1e-08
   f64.mul
   local.get $5
   f64.mul
   f64.sub
  else
   local.get $1
   f64.const 0.000265
   f64.mul
   f64.const -0.000278
   f64.add
   local.get $2
   f64.const 0.000262
   f64.mul
   f64.add
  end
  f64.sub
 )
 (func $assembly/calendar/newMoonDay (param $0 i32) (param $1 f64) (result i32)
  local.get $0
  call $assembly/calendar/newMoon
  f64.const 0.5
  f64.add
  local.get $1
  f64.const 24
  f64.div
  f64.add
  f64.floor
  i32.trunc_sat_f64_s
 )
 (func $assembly/calendar/sunSector (param $0 i32) (param $1 f64) (result i32)
  (local $2 f64)
  local.get $0
  f64.convert_i32_s
  f64.const -0.5
  f64.add
  local.get $1
  f64.const 24
  f64.div
  f64.sub
  f64.const -2451545
  f64.add
  f64.const 36525
  f64.div
  local.tee $1
  local.get $1
  f64.mul
  local.set $2
  local.get $1
  f64.const 36000.76983
  f64.mul
  f64.const 280.46645
  f64.add
  local.get $2
  f64.const 0.0003032
  f64.mul
  f64.add
  f64.const 1.9146
  local.get $1
  f64.const 0.004817
  f64.mul
  f64.sub
  local.get $2
  f64.const 0.000014
  f64.mul
  f64.sub
  local.get $1
  f64.const 35999.0503
  f64.mul
  f64.const 357.5291
  f64.add
  local.get $2
  f64.const 0.0001559
  f64.mul
  f64.sub
  local.get $1
  f64.const 4.8e-07
  f64.mul
  local.get $2
  f64.mul
  f64.sub
  local.tee $2
  f64.const 0.017453292519943295
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.mul
  f64.const 0.019993
  local.get $1
  f64.const 0.000101
  f64.mul
  f64.sub
  local.get $2
  f64.const 0.03490658503988659
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.mul
  f64.add
  local.get $2
  f64.const 0.05235987755982989
  f64.mul
  call $~lib/math/NativeMath.sin
  f64.const 0.00029
  f64.mul
  f64.add
  f64.add
  f64.const 0.017453292519943295
  f64.mul
  local.tee $1
  local.get $1
  f64.const 6.283185307179586
  f64.div
  f64.floor
  f64.const 6.283185307179586
  f64.mul
  f64.sub
  f64.const 3.141592653589793
  f64.div
  f64.const 6
  f64.mul
  f64.floor
  i32.trunc_sat_f64_s
 )
 (func $assembly/calendar/month11 (param $0 i32) (param $1 f64) (result i32)
  (local $2 i32)
  i32.const 31
  i32.const 12
  local.get $0
  call $assembly/calendar/julianDay
  i32.const 2415021
  i32.sub
  f64.convert_i32_s
  f64.const 29.530588853
  f64.div
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $0
  local.get $1
  call $assembly/calendar/newMoonDay
  local.tee $2
  local.get $1
  call $assembly/calendar/sunSector
  i32.const 9
  i32.ge_s
  if (result i32)
   local.get $0
   i32.const 1
   i32.sub
   local.get $1
   call $assembly/calendar/newMoonDay
  else
   local.get $2
  end
 )
 (func $assembly/calendar/solarToLunarPacked (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f64) (result i64)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  local.get $1
  local.get $2
  call $assembly/calendar/julianDay
  local.tee $5
  f64.convert_i32_s
  f64.const -2415021.076998695
  f64.add
  f64.const 29.530588853
  f64.div
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $0
  i32.const 1
  i32.add
  local.get $3
  call $assembly/calendar/newMoonDay
  local.tee $4
  local.get $5
  i32.gt_s
  if
   local.get $0
   local.get $3
   call $assembly/calendar/newMoonDay
   local.set $4
  end
  local.get $2
  local.get $3
  call $assembly/calendar/month11
  local.tee $0
  local.set $1
  local.get $0
  local.get $4
  i32.ge_s
  if
   local.get $2
   i32.const 1
   i32.sub
   local.get $3
   call $assembly/calendar/month11
   local.set $0
  else
   local.get $2
   i32.const 1
   i32.add
   local.tee $2
   local.get $3
   call $assembly/calendar/month11
   local.set $1
  end
  local.get $5
  local.get $4
  i32.sub
  i32.const 1
  i32.add
  local.set $5
  local.get $4
  local.get $0
  i32.sub
  i32.const 29
  i32.div_s
  local.tee $4
  i32.const 11
  i32.add
  local.set $7
  local.get $1
  local.get $0
  i32.sub
  i32.const 365
  i32.gt_s
  if (result i32)
   i32.const 1
   local.set $1
   local.get $0
   f64.convert_i32_s
   f64.const -2415021.076998695
   f64.add
   f64.const 29.530588853
   f64.div
   f64.const 0.5
   f64.add
   f64.floor
   i32.trunc_sat_f64_s
   local.tee $6
   i32.const 1
   i32.add
   local.get $3
   call $assembly/calendar/newMoonDay
   local.get $3
   call $assembly/calendar/sunSector
   local.set $0
   loop $do-loop|0
    local.get $0
    local.get $6
    local.get $1
    i32.const 1
    i32.add
    local.tee $1
    i32.add
    local.get $3
    call $assembly/calendar/newMoonDay
    local.get $3
    call $assembly/calendar/sunSector
    local.tee $0
    i32.ne
    local.get $1
    i32.const 14
    i32.lt_s
    i32.and
    br_if $do-loop|0
   end
   local.get $1
   i32.const 1
   i32.sub
   local.tee $0
   local.get $4
   i32.le_s
   if (result i32)
    local.get $4
    i32.const 10
    i32.add
    local.set $7
    local.get $0
    local.get $4
    i32.eq
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  i32.eqz
  i32.eqz
  i64.extend_i32_u
  local.get $2
  i32.const 1
  i32.sub
  local.get $2
  local.get $4
  i32.const 4
  i32.lt_s
  local.get $7
  i32.const 12
  i32.sub
  local.get $7
  local.get $7
  i32.const 12
  i32.gt_s
  select
  local.tee $0
  i32.const 11
  i32.ge_s
  i32.and
  select
  i32.const 10000
  i32.mul
  local.get $0
  i32.const 100
  i32.mul
  i32.add
  local.get $5
  i32.add
  i64.extend_i32_s
  i64.const 1
  i64.shl
  i64.add
 )
 (func $~lib/math/NativeMath.cos (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i64)
  (local $5 i32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $4
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 31
  i32.shr_u
  local.set $3
  local.get $5
  i32.const 2147483647
  i32.and
  local.tee $5
  i32.const 1072243195
  i32.le_u
  if
   local.get $5
   i32.const 1044816030
   i32.lt_u
   if
    f64.const 1
    return
   end
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   local.set $2
   f64.const 1
   local.get $1
   f64.const 0.5
   f64.mul
   local.tee $6
   f64.sub
   local.tee $7
   f64.const 1
   local.get $7
   f64.sub
   local.get $6
   f64.sub
   local.get $1
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $2
   local.get $2
   f64.mul
   local.get $1
   local.get $1
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   f64.const 0
   f64.mul
   f64.sub
   f64.add
   f64.add
   return
  end
  local.get $5
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.1 (result i32)
   local.get $4
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $5
   i32.const 1094263291
   i32.lt_u
   if
    local.get $5
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $6
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $6
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $6
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $6
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $6
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $6
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $6
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.1
   end
   i32.const 0
   local.get $4
   call $~lib/math/pio2_large_quot
   local.tee $5
   i32.sub
   local.get $5
   local.get $3
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $1
  global.get $~lib/math/rempio2_y1
  local.set $2
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $1
   local.get $1
   f64.mul
   local.tee $0
   local.get $1
   f64.mul
   local.set $6
   local.get $1
   local.get $0
   local.get $2
   f64.const 0.5
   f64.mul
   local.get $6
   local.get $0
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $2
   f64.sub
   local.get $6
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  else
   local.get $1
   local.get $1
   f64.mul
   local.tee $0
   local.get $0
   f64.mul
   local.set $6
   f64.const 1
   local.get $0
   f64.const 0.5
   f64.mul
   local.tee $7
   f64.sub
   local.tee $8
   f64.const 1
   local.get $8
   f64.sub
   local.get $7
   f64.sub
   local.get $0
   local.get $0
   local.get $0
   local.get $0
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $6
   local.get $6
   f64.mul
   local.get $0
   local.get $0
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $1
   local.get $2
   f64.mul
   f64.sub
   f64.add
   f64.add
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 1
  i32.add
  i32.const 2
  i32.and
  select
 )
 (func $assembly/calendar/equationOfTimeMinutes (param $0 i32) (result f64)
  (local $1 f64)
  local.get $0
  i32.const 81
  i32.sub
  f64.convert_i32_s
  f64.const 6.283185307179586
  f64.mul
  f64.const 364
  f64.div
  local.tee $1
  local.get $1
  f64.add
  call $~lib/math/NativeMath.sin
  f64.const 9.87
  f64.mul
  local.get $1
  call $~lib/math/NativeMath.cos
  f64.const 7.53
  f64.mul
  f64.sub
  local.get $1
  call $~lib/math/NativeMath.sin
  f64.const 1.5
  f64.mul
  f64.sub
 )
)
