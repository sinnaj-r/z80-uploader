program Download;

const
   RecSize = 128;
   BufSize = 25600;

type
   Str2 = string[2];
   Str4 = string[4];
   HexLine = string[45];
   ByteBuffer = array[1 .. BufSize] of Byte;

var
   ContLoop: boolean;
   DataFile: file;
   CurrentLine: HexLine;
   Buffer: ByteBuffer;
   RecsWritten: Integer;
   InitalOffset: Integer;
   BytesWrittenTotal: Integer;

function HexToInt (var St: Str2): Byte;
    var
       Code : Integer;
       i : Integer;
    begin
         St := Concat('$',St);
         Val(St,i,Code);
         HexToInt:=i;
         IF Code <> 0 then
         begin
              HexToInt:=0;
         end;
    end;

function DoubleHexToInt (var St: Str4): Integer;
    var
       Part1St: Str2;
       Part2St: Str2;
       Part1: integer;
       Part2: integer;
    begin
       Part1St := Copy(St, 1,2);
       Part2St := Copy(St, 3,4);
       Part1 := HexToInt(Part1St);
       Part2 := HexToInt(Part2St);
       DoubleHexToInt := (Part1 shl 8) + Part2;
    end;


procedure ParseHex (Line: HexLine);
    var
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
    begin
       ByteCountSt:= Copy(Line, 2,2);
       ByteCount:= HexToInt(ByteCountSt);
       AddressSt := Copy(Line, 3,4);
       Address := DoubleHexToInt(AddressSt);
       HexType := Copy(Line, 8,2);
       DataEnd:= 10 + (ByteCount * 2);

       if(HexType = '02') then InitalOffset:= Address;

       if(HexType = '00') then ContLoop := False;

       if(HexType = '10') then
       PosIndex := 1;
       begin
           while(Pos <= DataEnd) do
           begin
             CurrentDataSt := Copy(Line, 10 + Pos, 2);
             CurrentData := HexToInt(CurrentDataSt);
             Buffer[PosIndex] := CurrentData;
             Pos := Pos + 2;
         end;
       end;
    end;

begin
  Assign(DataFile, ParamStr(1));
  Rewrite(DataFile);
  while ContLoop do
  begin
      ReadLn(CurrentLine);
      ContLoop := CurrentLine <> '';
      if(ContLoop) then
      begin
           ParseHex(CurrentLine);
      end;
      BlockWrite(DataFile, Buffer, RecsWritten);
  end;
  Close(DataFile);

end.