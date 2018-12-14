
-- Table Encyklopedia_Gier

CREATE TABLE [Encyklopedia_Gier]
(
 [id_gry] Int NOT NULL,
 [id_czasu_premiery] Int NOT NULL,
 [id_wym] Int NOT NULL,
 [id_lapki] Int NOT NULL
)
go

-- Add keys for table Encyklopedia_Gier

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [Key1] PRIMARY KEY ([id_wym],[id_lapki],[id_czasu_premiery],[id_gry])
go

-- Table Gra

CREATE TABLE [Gra]
(
 [id_gry] Int IDENTITY NOT NULL,
 [tytul] Varchar(300) NULL,
 [producent] Varchar(300) NULL,
 [platformy] Varchar(300) NULL,
 [kategoria] Varchar(300) NULL,
 [wydawca] Varchar(300) NULL,
 [srednia_ocen] Float NULL,
 [ilosc_ocen] Int NULL
)
go

-- Add keys for table Gra

ALTER TABLE [Gra] ADD CONSTRAINT [Key2] PRIMARY KEY ([id_gry])
go

-- Table Data premiery

CREATE TABLE [Data_premiery]
(
 [id_czasu_premiery] Int IDENTITY NOT NULL,
 [dzien] Int NULL,
 [miesiac] Int NULL,
 [rok] Int NULL
)
go

-- Add keys for table Data premiery

ALTER TABLE [Data_premiery] ADD CONSTRAINT [Key3] PRIMARY KEY ([id_czasu_premiery])
go

-- Table Data posta

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

-- Add keys for table Data posta

ALTER TABLE [Data_posta] ADD CONSTRAINT [Key4] PRIMARY KEY ([id_czasu_posta])
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
 [rekomendowane] Varchar(300) NULL,
 [minimalne] Varchar(300) NULL
)
go

-- Add keys for table Wymagania_sprzetowe

ALTER TABLE [Wymagania_sprzetowe] ADD CONSTRAINT [Key6] PRIMARY KEY ([id_wym])
go

-- Table Posty

CREATE TABLE [Posty]
(
 [id_posta] Int IDENTITY NOT NULL,
 [id_gry] Int NOT NULL,
 [id_czasu_posta] Int NULL,
 [login] Varchar(300) NULL,
 [ranga] Int NULL,
 [stopien] Varchar(300) NULL,
 [tresc] Varchar(8000) NULL
)
go

-- Add keys for table Posty

ALTER TABLE [Posty] ADD CONSTRAINT [Key9] PRIMARY KEY ([id_gry],[id_posta])
go

-- Table Podobne

CREATE TABLE [Podobne]
(
 [id_podobne] Int IDENTITY NOT NULL,
 [podobne] Varchar(300) NULL
)
go

-- Add keys for table Podobne

ALTER TABLE [Podobne] ADD CONSTRAINT [Key7] PRIMARY KEY ([id_podobne])
go

-- Table Tagi

CREATE TABLE [Tagi]
(
 [id_tagi] Int IDENTITY NOT NULL,
 [tagi] Varchar(300) NULL
)
go

-- Add keys for table Tagi

ALTER TABLE [Tagi] ADD CONSTRAINT [Key8] PRIMARY KEY ([id_tagi])
go

-- Table Gra_podobne

CREATE TABLE [Gra_podobne]
(
 [id_gry] Int NOT NULL,
 [id_podobne] Int NOT NULL
)
go

-- Add keys for table Gra_podobne

ALTER TABLE [Gra_podobne] ADD CONSTRAINT [Key10] PRIMARY KEY ([id_gry],[id_podobne])
go

-- Table Gra_tagi

CREATE TABLE [Gra_tagi]
(
 [id_gry] Int NOT NULL,
 [id_tagi] Int NOT NULL
)
go

-- Add keys for table Gra_tagi

ALTER TABLE [Gra_tagi] ADD CONSTRAINT [Key11] PRIMARY KEY ([id_gry],[id_tagi])
go

-- Create relationships section -------------------------------------------------

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R2] FOREIGN KEY ([id_wym]) REFERENCES [Wymagania_sprzetowe] ([id_wym]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [Relationship9] FOREIGN KEY ([id_lapki]) REFERENCES [Lapki] ([id_lapki]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [Relationship17] FOREIGN KEY ([id_czasu_premiery]) REFERENCES [Data_premiery] ([id_czasu_premiery]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Encyklopedia_Gier] ADD CONSTRAINT [R1] FOREIGN KEY ([id_gry]) REFERENCES [Gra] ([id_gry]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Posty] ADD CONSTRAINT [Relationship23] FOREIGN KEY ([id_czasu_posta]) REFERENCES [Data_posta] ([id_czasu_posta]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Posty] ADD CONSTRAINT [Relationship24] FOREIGN KEY ([id_gry]) REFERENCES [Gra] ([id_gry]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Gra_podobne] ADD CONSTRAINT [Relationship25] FOREIGN KEY ([id_gry]) REFERENCES [Gra] ([id_gry]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Gra_tagi] ADD CONSTRAINT [Relationship26] FOREIGN KEY ([id_gry]) REFERENCES [Gra] ([id_gry]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Gra_podobne] ADD CONSTRAINT [Relationship27] FOREIGN KEY ([id_podobne]) REFERENCES [Podobne] ([id_podobne]) ON UPDATE NO ACTION ON DELETE NO ACTION
go

ALTER TABLE [Gra_tagi] ADD CONSTRAINT [Relationship28] FOREIGN KEY ([id_tagi]) REFERENCES [Tagi] ([id_tagi]) ON UPDATE NO ACTION ON DELETE NO ACTION
go


