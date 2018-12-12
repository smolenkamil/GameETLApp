
-- Create tables section -------------------------------------------------

-- Table Encyklopedia_Gier

CREATE TABLE [Encyklopedia_Gier]
(
 [id_gry] Int NOT NULL,
 [id_czasu_premiery] Int NOT NULL,
 [id_wym] Int NOT NULL,
 [id_posta] Int NOT NULL,
 [id_czasu_posta] Int NOT NULL,
 [id_lapki] Int NOT NULL,
 [id_podobne] Int NOT NULL,
 [id_tagi] Int NOT NULL
)
go

-- Add keys for table Encyklopedia_Gier

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [Key1] PRIMARY KEY ([id_wym],[id_posta],[id_gry],[id_czasu_premiery],[id_czasu_posta],[id_lapki],[id_podobne],[id_tagi])
go

-- Table Gra

CREATE TABLE [Gra]
(
 [id_gry] Int IDENTITY NOT NULL,
 [id_czasu_premiery] Int NOT NULL,
 [tytul] Varchar(200) NULL,
 [producent] Varchar(200) NULL,
 [platformy] Varchar(200) NULL,
 [kategoria] Varchar(200) NULL,
 [wydawca] Varchar(200) NULL,
 [srednia_ocen] Float NULL,
 [ilosc_ocen] Int NULL
)
go

-- Add keys for table Gra

ALTER TABLE [Gra] ADD CONSTRAINT [Key2] PRIMARY KEY ([id_gry],[id_czasu_premiery])
go

-- Table Data_premiery

CREATE TABLE [Data_premiery]
(
 [id_czasu_premiery] Int IDENTITY NOT NULL,
 [dzien] Int NULL,
 [miesiac] Int NULL,
 [rok] Int NULL
)
go

-- Add keys for table Data_premiery

ALTER TABLE [Data_premiery] ADD CONSTRAINT [Key3] PRIMARY KEY ([id_czasu_premiery])
go

-- Table Data_posta

CREATE TABLE [Data_posta]
(
 [id_czasu_posta] Int IDENTITY NOT NULL,
 [dzien] Int NULL,
 [miesiac] Int NULL,
 [rok] Int NULL,
 [godzina] Int NULL,
 [minuta] Int NULL
)
go

-- Add keys for table Data_posta

ALTER TABLE [Data_posta] ADD CONSTRAINT [Key3] PRIMARY KEY ([id_czasu_posta])
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
 [rekomendowane] Varchar(200) NULL,
 [minimalne] Varchar(200) NULL
)
go

-- Add keys for table Wymagania_sprzetowe

ALTER TABLE [Wymagania_sprzetowe] ADD CONSTRAINT [Key6] PRIMARY KEY ([id_wym])
go

-- Table Posty

CREATE TABLE [Posty]
(
 [id_posta] Int IDENTITY NOT NULL,
 [id_czasu_posta] Int NOT NULL,
 [login] Varchar(200) NULL,
 [ranga] Int NULL,
 [stopien] Varchar(200) NULL,
 [tresc] Varchar(max) NULL
)
go

-- Add keys for table Posty

ALTER TABLE [Posty] ADD CONSTRAINT [Key9] PRIMARY KEY ([id_posta],[id_czasu_posta])
go

-- Table Podobne

CREATE TABLE [Podobne]
(
 [id_podobne] Int IDENTITY NOT NULL,
 [podobne] Varchar(max) NULL
)
go

-- Add keys for table Podobne

ALTER TABLE [Podobne] ADD CONSTRAINT [PK_Podobne] PRIMARY KEY ([id_podobne])
go

-- Table Tagi

CREATE TABLE [Tagi]
(
 [id_tagi] Int IDENTITY NOT NULL,
 [tagi] Varchar(200) NULL
)
go

-- Add keys for table Tagi

ALTER TABLE [Tagi] ADD CONSTRAINT [PK_Tagi] PRIMARY KEY ([id_tagi])
go

-- Create foreign keys (relationships) section -------------------------------------------------


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R2] FOREIGN KEY ([id_wym]) REFERENCES [Wymagania_sprzetowe] ([id_wym]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R4] FOREIGN KEY ([id_posta], [id_czasu_posta]) REFERENCES [Posty] ([id_posta], [id_czasu_posta]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Gra] ADD CONSTRAINT [R5] FOREIGN KEY ([id_czasu_premiery]) REFERENCES [Data_premiery] ([id_czasu_premiery]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R1] FOREIGN KEY ([id_gry], [id_czasu_premiery]) REFERENCES [Gra] ([id_gry], [id_czasu_premiery]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Posty] ADD CONSTRAINT [R6] FOREIGN KEY ([id_czasu_posta]) REFERENCES [Data_posta] ([id_czasu_posta]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R8] FOREIGN KEY ([id_lapki]) REFERENCES [Lapki] ([id_lapki]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R3] FOREIGN KEY ([id_podobne]) REFERENCES [Podobne] ([id_podobne]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R7] FOREIGN KEY ([id_tagi]) REFERENCES [Tagi] ([id_tagi]) ON UPDATE NO ACTION ON DELETE NO ACTION
go



