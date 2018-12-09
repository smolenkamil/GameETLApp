-- Create tables section -------------------------------------------------

-- Table Encyklopedia_Gier

CREATE TABLE [Encyklopedia_Gier]
(
 [id_gry] Int NOT NULL,
 [id_czasu] Int NOT NULL,
 [id_wym] Int NOT NULL,
 [id_oceny] Int NOT NULL,
 [id_postu] Int NOT NULL
)
go

-- Add keys for table Encyklopedia_Gier

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [Key1] PRIMARY KEY ([id_wym],[id_oceny],[id_postu],[id_gry],[id_czasu])
go

-- Table Gra

CREATE TABLE [Gra]
(
 [id_gry] Int IDENTITY(1,1) NOT NULL,
 [id_czasu] Int NOT NULL,
 [tytul] Varchar(50) NULL,
 [platformy] Varchar(50) NULL,
 [kategoria] Varchar(50) NULL,
 [wydawca] Varchar(50) NULL,
 [tagi] Varchar(50) NULL,
 [podobne] Varchar(50) NULL
)
go

-- Add keys for table Gra

ALTER TABLE [Gra] ADD CONSTRAINT [Key2] PRIMARY KEY ([id_gry],[id_czasu])
go

-- Table Data

CREATE TABLE [Data]
(
 [id_czasu] Int IDENTITY NOT NULL,
 [dzien] Int NULL,
 [miesiac] Int NULL,
 [rok] Int NULL
)
go

-- Add keys for table Data

ALTER TABLE [Data] ADD CONSTRAINT [Key3] PRIMARY KEY ([id_czasu])
go

-- Table Oceny

CREATE TABLE [Oceny]
(
 [id_oceny] Int IDENTITY NOT NULL,
 [wartosc] Varchar(50) NULL,
 [ilosc_ocen] Int NULL,
 [id_lapki] Int NULL
)
go

-- Create indexes for table Oceny

CREATE INDEX [IX_Relationship19] ON [Oceny] ([id_lapki])
go

-- Add keys for table Oceny

ALTER TABLE [Oceny] ADD CONSTRAINT [Key4] PRIMARY KEY ([id_oceny])
go

-- Table Lapki

CREATE TABLE [Lapki]
(
 [id_lapki] Int IDENTITY NOT NULL,
 [w_gore] Int NULL,
 [w_dol] Int NULL
)
go

-- Add keys for table Lapki

ALTER TABLE [Lapki] ADD CONSTRAINT [Key5] PRIMARY KEY ([id_lapki])
go

-- Table Wymagania_sprzetowe

CREATE TABLE [Wymagania_sprzetowe]
(
 [id_wym] Int IDENTITY NOT NULL,
 [id_platformy] Int NULL,
 [rekomendowane] Varchar(200) NULL,
 [minimalne] Varchar(200) NULL,
 [id_rek] Int NULL
)
go

-- Create indexes for table Wymagania_sprzetowe

CREATE INDEX [IX_Relationship16] ON [Wymagania_sprzetowe] ([id_platformy])
go

CREATE INDEX [IX_Relationship17] ON [Wymagania_sprzetowe] ([id_rek])
go

-- Add keys for table Wymagania_sprzetowe

ALTER TABLE [Wymagania_sprzetowe] ADD CONSTRAINT [Key6] PRIMARY KEY ([id_wym])
go

-- Table platforma

CREATE TABLE [platforma]
(
 [id_platformy] Int IDENTITY NOT NULL,
 [nazwa_platformy] Varchar(50) NULL
)
go

-- Add keys for table platforma

ALTER TABLE [platforma] ADD CONSTRAINT [Key7] PRIMARY KEY ([id_platformy])
go

-- Table Rekomendacje

CREATE TABLE [Rekomendacje]
(
 [id_rek] Int IDENTITY NOT NULL,
 [nazwa_komputera] Varchar(50) NULL,
 [karta_graficzna] Varchar(50) NULL,
 [procesor] Varchar(50) NULL,
 [ram] Varchar(50) NULL,
 [matryca] Varchar(50) NULL,
 [dysk] Varchar(50) NULL
)
go

-- Add keys for table Rekomendacje

ALTER TABLE [Rekomendacje] ADD CONSTRAINT [Key8] PRIMARY KEY ([id_rek])
go

-- Table Posty

CREATE TABLE [Posty]
(
 [id_postu] Int IDENTITY NOT NULL,
 [id_czasu] Int NULL,
 [login] Varchar(200) NULL,
 [ranga] Int NULL,
 [stopien] Varchar(50) NULL,
 [tresc] Varchar(max) NULL
)
go

-- Create indexes for table Posty

CREATE INDEX [IX_Relationship21] ON [Posty] ([id_czasu])
go

-- Add keys for table Posty

ALTER TABLE [Posty] ADD CONSTRAINT [Key9] PRIMARY KEY ([id_postu])
go

-- Create relationships section -------------------------------------------------

ALTER TABLE [Wymagania_sprzetowe] ADD CONSTRAINT [R6] FOREIGN KEY ([id_platformy]) REFERENCES [platforma] ([id_platformy]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Wymagania_sprzetowe] ADD CONSTRAINT [R7] FOREIGN KEY ([id_rek]) REFERENCES [Rekomendacje] ([id_rek]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R2] FOREIGN KEY ([id_wym]) REFERENCES [Wymagania_sprzetowe] ([id_wym]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Oceny] ADD CONSTRAINT [R8] FOREIGN KEY ([id_lapki]) REFERENCES [Lapki] ([id_lapki]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R3] FOREIGN KEY ([id_oceny]) REFERENCES [Oceny] ([id_oceny]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Posty] ADD CONSTRAINT [R9] FOREIGN KEY ([id_czasu]) REFERENCES [Data] ([id_czasu]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R4] FOREIGN KEY ([id_postu]) REFERENCES [Posty] ([id_postu]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Gra] ADD CONSTRAINT [R5] FOREIGN KEY ([id_czasu]) REFERENCES [Data] ([id_czasu]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R1] FOREIGN KEY ([id_gry], [id_czasu]) REFERENCES [Gra] ([id_gry], [id_czasu]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


