# 🎨 Animasi Nexfora Web

## Overview
Website Nexfora dilengkapi dengan animasi smooth yang meningkatkan user experience saat pertama kali membuka website.

---

## 🎬 Animasi yang Diterapkan

### **1. Homepage Animations**

#### Navbar
- **Animasi**: Fade-in from top
- **Durasi**: 0.8s
- **Efek**: Navbar muncul smooth dari atas

#### Hero Section
- **Heading**: Fade-in from bottom (delay: 0.2s)
- **Description**: Fade-in from bottom (delay: 0.4s)  
- **CTA Button**: Scale-in animation (delay: 0.6s)
- **Efek**: Teks muncul berurutan dengan timing yang natural

#### Service Cards
- **Animasi**: Fade-in staggered
- **Delay**: Setiap card memiliki delay berbeda (0.4s, 0.5s, 0.6s, 0.7s)
- **Efek**: Cards muncul satu per satu dengan timing yang smooth

#### Footer
- **Animasi**: Fade-in from bottom
- **Delay**: 0.8s
- **Efek**: Footer muncul terakhir setelah semua konten

---

### **2. Interactive Animations**

#### Product Cards Hover
- **Transform**: Lift up (-8px)
- **Border**: Glow effect (blue-500)
- **Shadow**: Enhanced shadow dengan blue glow
- **Duration**: 0.5s
- **Efek**: Card terangkat saat hover dengan efek cahaya

#### Button Hover
- **Scale**: 1.05x
- **Shadow**: Glowing shadow
- **Duration**: 0.3s
- **Efek**: Button membesar sedikit dengan efek glow

#### Navigation Links
- **Color**: Smooth color transition
- **Duration**: 0.3s
- **Efek**: Perubahan warna smooth

---

### **3. Login Page Animations**

#### Logo & Title
- **Animasi**: Fade-in from top
- **Duration**: 0.8s
- **Efek**: Logo muncul dari atas

#### Login Card
- **Animasi**: Scale-in
- **Delay**: 0.2s
- **Duration**: 0.6s
- **Efek**: Card muncul dengan efek zoom-in

#### Back Button
- **Animasi**: Fade-in
- **Delay**: 0.4s
- **Hover**: Slide left (4px)
- **Efek**: Button muncul smooth, slide ke kiri saat hover

---

## 🎨 Custom Animations

### Available Animation Classes:

```css
.animate-fade-in          /* Fade in from bottom */
.animate-fade-in-down     /* Fade in from top */
.animate-fade-in-up       /* Fade in from bottom (larger distance) */
.animate-slide-in-left    /* Slide from left */
.animate-slide-in-right   /* Slide from right */
.animate-scale-in         /* Zoom in effect */
```

### Delay Classes:

```css
.delay-100   /* 0.1s delay */
.delay-200   /* 0.2s delay */
.delay-300   /* 0.3s delay */
.delay-400   /* 0.4s delay */
.delay-500   /* 0.5s delay */
.delay-600   /* 0.6s delay */
.delay-700   /* 0.7s delay */
.delay-800   /* 0.8s delay */
```

---

## 🛠️ Technical Details

### Animation Keyframes
All animations are defined in `src/index.css` using CSS keyframes:

- **fadeIn**: Opacity 0→1, translateY 20px→0
- **fadeInDown**: Opacity 0→1, translateY -20px→0
- **fadeInUp**: Opacity 0→1, translateY 30px→0
- **slideInLeft**: Opacity 0→1, translateX -50px→0
- **slideInRight**: Opacity 0→1, translateX 50px→0
- **scaleIn**: Opacity 0→1, scale 0.9→1

### Smooth Scroll
```css
html {
  scroll-behavior: smooth;
}
```

### Custom Scrollbar
- **Width**: 10px
- **Track**: Dark background (#1a1a2e)
- **Thumb**: Blue-purple gradient
- **Hover**: Darker gradient

---

## 🎯 Best Practices

1. **Timing**: Animations tidak terlalu cepat atau lambat (0.3s - 0.8s)
2. **Stagger**: Delay antar elemen untuk efek berurutan
3. **Easing**: `ease-out` untuk natural feel
4. **Performance**: Menggunakan `transform` dan `opacity` untuk performa optimal
5. **Accessibility**: Animasi tidak mengganggu usability

---

## 📱 Responsive Behavior

Semua animasi bekerja di:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

Animasi otomatis menyesuaikan dengan ukuran layar.

---

## 🚀 Future Enhancements

Potensi animasi tambahan:
- [ ] Parallax scrolling effect
- [ ] Loading skeleton screens
- [ ] Page transition animations
- [ ] Micro-interactions pada form inputs
- [ ] Animated counters untuk statistik
- [ ] Intersection Observer untuk scroll-triggered animations

---

**Created by**: Nexfora Development Team  
**Last Updated**: October 23, 2025
