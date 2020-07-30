
Program Download;

Const 
  RecSize = 128;
  BufSize = 25600;

Type 
  Str2 = string[2];
  Str4 = string[4];
  Str3 = string[3];
  HexLine = string[45];
  ByteBuffer = array[1 .. BufSize] Of Byte;

Var 
  ContLoop: boolean;
  DataFile: file;
  CurrentLine: HexLine;
  Buffer: ByteBuffer;
  RecsWritten: Integer;
  InitalOffset: Integer;
  BytesWrittenTotal: Integer;
  PosIndex: Integer;

Function HexToInt (Var St: Str2): Byte;

Var 
  WorkingStr: Str3;
  Code : Integer;
  i : Integer;
Begin
  WorkingStr := Concat('$',St);
  Val(WorkingStr,i,Code);
  HexToInt := i;
  If Code <> 0 Then
    Begin
      HexToInt := 0;
    End;
End;

Function DoubleHexToInt (Var St: Str4): Integer;

Var 
  Part1St: Str2;
  Part2St: Str2;
  Part1: integer;
  Part2: integer;
Begin
  Part1St := Copy(St, 1,2);
  Part2St := Copy(St, 3,4);
  Part1 := HexToInt(Part1St);
  Part2 := HexToInt(Part2St);
  DoubleHexToInt := (Part1 shl 8) + Part2;
End;


Procedure ParseHex (Line: HexLine);

Var 
  ByteCountSt: Str2;
  ByteCount: integer;
  AddressSt: Str4;
  Address: integer;
  HexType: Str2;
  DataEnd: integer;
  ChecksumStr: str2;
  Checksum: integer;
  Pos: integer;
  CurrentDataSt: Str2;
  CurrentData: Byte;
  CurrentSum: integer;
Begin
  ByteCountSt := Copy(Line, 2,2);
  ByteCount := HexToInt(ByteCountSt);
  AddressSt := Copy(Line, 4,4);
  Address := DoubleHexToInt(AddressSt);
  HexType := Copy(Line, 8,2);
  DataEnd := 10 + (ByteCount * 2) - 2;
  ChecksumStr := Copy(Line, DataEnd + 2, 2);
  Checksum := HexToInt(ChecksumStr);

  CurrentSum := ByteCount;
  CurrentSum := CurrentSum + (Address - ((Address shr 8) shl 8));
  CurrentSum := CurrentSum + (Address shr 8);
  CurrentSum := CurrentSum + HexToInt(HexType);
  CurrentSum := CurrentSum + Checksum;


  If (HexType = '01') Then ContLoop := False;

  If (HexType = '00') Then
    Begin
      Pos := 10;
      While Pos <= DataEnd Do
        Begin
          CurrentDataSt := Copy(Line, Pos, 2);
          CurrentData := HexToInt(CurrentDataSt);
          CurrentSum := CurrentSum + CurrentData;
          Buffer[PosIndex] := CurrentData;
          Pos := Pos + 2;
          PosIndex := PosIndex + 1;
        End;
    End;
  If ((CurrentSum And 255) = 0) Then
    write('.')
  Else
    writeln('x');

End;

Begin
  Assign(DataFile, ParamStr(1));
  Rewrite(DataFile);
  PosIndex := 1;
  ContLoop := True;
  While ContLoop Do
    Begin
      ReadLn(CurrentLine);
      ContLoop := CurrentLine <> '';
      If (ContLoop) Then
        Begin
          ParseHex(CurrentLine);
        End;
      If ((PosIndex Div 128 >= 1) Or Not ContLoop) Then
        Begin
          BlockWrite(DataFile, Buffer, 1);
          PosIndex := 1;
        End;
    End;
  Close(DataFile);

End.
