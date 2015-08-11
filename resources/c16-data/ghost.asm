;	Ghost Town C64 Test
; 	awsm 2015


!to "build/ghost16.prg",cbm

* = $1000                               ; BASIC start address (#2049)
!byte $0d,$08,$dc,$07,$9e,$20,$31,$32   ; BASIC loader to start at $c000...
!byte $32,$38,$38,$00,$00,$00           ; puts BASIC line 2012 SYS 49152

*=$0c00
!bin "screen-abc.bin",,2

*=$1800
!bin "col-ghost.bin",,2

*=$d000
!bin "char-ghost.bin",,2

*=$4000



; set char memory = 2000
; and screen memory = 0c00
	lda #$38
	sta $d018

; screen = multicolor with 40 chars
	lda #$d8
	sta $d016



-	jmp -




