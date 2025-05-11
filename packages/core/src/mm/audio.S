#include <combo.h>

PATCH_START 0x801DB9B4
  .int 0x6000
PATCH_END

PATCH_START 0x801DB9B8
 .int 0x6000
PATCH_END

/* Fix a vanilla bug that can cause a crash with some custom songs */
PATCH_START 0x80198ffc
  move t6,t5
PATCH_END
