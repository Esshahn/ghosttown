;	Ghost Town C64 Test
; 	awsm 2015


!to "build/ghostr.prg",cbm

* = $0801                               ; BASIC start address (#2049)
!byte $0d,$08,$dc,$07,$9e,$20,$31,$32   ; BASIC loader to start at $c000...
!byte $32,$38,$38,$00,$00,$00           ; puts BASIC line 2012 SYS 49152

*=$0c00
!bin "screen-.bin",,2

*=$1800
!bin "col-.bin",,2

*=$2000
!bin "ghostchar.bin",,2

*=$3000

; copy color ram to new position
	ldx #$00
- 	lda $1800,x
	sta $d800,x
	lda $1900,x
	sta $d900,x
	lda $1a00,x
	sta $da00,x
	lda $1b00,x
	sta $db00,x
	dex
	bne -

; background color = black
	lda #$01
	sta $d021

; border color = red
	lda #$02
	sta $d020

; extra background color
	lda #$0a
	sta $d022

; extra background color 2
	lda #$09
	sta $d023

; set char memory = 2000
; and screen memory = 0c00
	lda #$38
	sta $d018

; screen = multicolor with 40 chars
	lda #$d8
	sta $d016

; highres standard chars
	lda #$34
	sta $d018
	lda #$c8
	sta $d016

-	jmp -




