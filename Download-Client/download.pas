
Program Download;

Const 
  RecSize = 128;
  BufSize = 25600;

Type 
  Str2 = string[2];
  Str4 = string[4];
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

Function HexToInt (Var St: Str2): Byte;

Var 
  Code : Integer;
  i : Integer;
Begin
  St := Concat('$',St);
  Val(St,i,Code);
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
  Checksum: str2;
  Pos: integer;
  PosIndex: Integer;
  CurrentDataSt: Str2;
  CurrentData: Byte;
Begin
  ByteCountSt := Copy(Line, 2,2);
  ByteCount := HexToInt(ByteCountSt);
  AddressSt := Copy(Line, 3,4);
  Address := DoubleHexToInt(AddressSt);
  HexType := Copy(Line, 8,2);
  DataEnd := 10 + (ByteCount * 2);

  If (HexType = '02') Then InitalOffset := Address;

  If (HexType = '00') Then ContLoop := False;

  If (HexType = '10') Then
    PosIndex := 1;
  Begin
    While (Pos <= DataEnd) Do
      Begin
        CurrentDataSt := Copy(Line, 10 + Pos, 2);
        CurrentData := HexToInt(CurrentDataSt);
        Buffer[PosIndex] := CurrentData;
        Pos := Pos + 2;
      End;
  End;
End;

Begin
  Assign(DataFile, ParamStr(1));
  Rewrite(DataFile);
  While ContLoop Do
    Begin
      ReadLn(CurrentLine);
      ContLoop := CurrentLine <> '';
      If (ContLoop) Then
        Begin
          ParseHex(CurrentLine);
        End;
      BlockWrite(DataFile, Buffer, RecsWritten);
    End;
  Close(DataFile);

End.
