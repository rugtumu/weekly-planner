# Haftalık Planlayıcı

Modern, dark themed weekly planner uygulaması. Eventler JSON dosyasından yüklenir.

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcınızda otomatik olarak `http://localhost:3000` açılacak.

## Event Yönetimi

Tüm eventler `src/events.json` dosyasında tanımlıdır. Bu dosyayı düzenleyerek haftalık planınızı oluşturun.

### Event Formatı

```json
{
  "id": 1,
  "name": "Event Adı",
  "day": "Pazartesi",
  "startTime": "09:00",
  "endTime": "10:00",
  "color": "#f59e0b"
}
```

### Gün İsimleri
`Pazartesi`, `Salı`, `Çarşamba`, `Perşembe`, `Cuma`, `Cumartesi`, `Pazar`

### Renk Seçenekleri
- `#f59e0b` - Amber
- `#3b82f6` - Blue
- `#10b981` - Green
- `#a855f7` - Purple
- `#ef4444` - Red
- `#ec4899` - Pink

### Örnek

```json
[
  {
    "id": 1,
    "name": "Sabah Koşusu",
    "day": "Pazartesi",
    "startTime": "07:00",
    "endTime": "08:00",
    "color": "#10b981"
  },
  {
    "id": 2,
    "name": "Toplantı",
    "day": "Pazartesi",
    "startTime": "09:00",
    "endTime": "10:00",
    "color": "#3b82f6"
  }
]
```

## Özellikler

- 7 günlük haftalık görünüm
- 24 saatlik zaman çizelgesi
- **JSON tabanlı event yönetimi** - Eventleri dosyadan düzenle
- **PNG export** - Haftalık planını görsel olarak kaydet/paylaş
- 6 farklı renk seçeneği
- Dark mode UI
- Responsive tasarım

## Kullanım

**Event Düzenleme:**
1. `src/events.json` dosyasını aç
2. Event ekle/çıkar/düzenle
3. Değişiklikleri kaydet
4. Tarayıcı otomatik yenilenecek

**PNG Export:**
1. Sağ üstteki "PNG Olarak İndir" butonuna tıklayın
2. Haftalık planınız PNG olarak indirilir

## Teknolojiler

- React 18
- Vite
- Tailwind CSS
- Lucide React (iconlar)
- html2canvas (PNG export)
