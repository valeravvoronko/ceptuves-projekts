// ===== Supabase — подключение напрямую (без сервера)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// === Твои данные Supabase ===
const SUPABASE_URL = 'https://pmnhrabammafeenoojhz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbmhyYWJhbW1hZmVlbm9vamh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDMwNDEsImV4cCI6MjA3NjI3OTA0MX0.zf0x99RHosYdZCnHQ0ORR6izKxP7C2E_pcJQO_SYKBw'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ===== Анимация появления блоков при скролле =====
const revealEls = document.querySelectorAll('.reveal')
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        io.unobserve(e.target)
      }
    })
  },
  { threshold: 0.15 }
)
revealEls.forEach((el) => io.observe(el))

// ===== Параллакс фона для первого блока =====
const hero = document.querySelector('.parallax-target')
let ticking = false
addEventListener(
  'scroll',
  () => {
    if (!hero) return
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = scrollY || pageYOffset
        hero.style.backgroundPosition = `center ${-y * 0.05}px`
        ticking = false
      })
      ticking = true
    }
  },
  { passive: true }
)

// ===== Отправка формы заказа в Supabase =====
const form = document.getElementById('order-form')
const result = document.getElementById('order-result')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    result.textContent = 'Отправляем...'
    result.style.color = '#333'

    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries()) // { name, email, message }

    // Простая валидация
    if (!payload.name || !payload.email || !payload.message) {
      result.textContent = 'Заполните все поля'
      result.style.color = 'crimson'
      return
    }

    try {
      const { error } = await supabase.from('orders').insert([payload]) // вставляем в базу

      if (error) {
        console.error(error)
        result.textContent = 'Ошибка: ' + (error.message || 'не удалось сохранить')
        result.style.color = 'crimson'
      } else {
        result.textContent = 'Заказ принят! Спасибо ❤️'
        result.style.color = 'green'
        form.reset()
      }
    } catch (err) {
      console.error(err)
      result.textContent = 'Не удалось связаться с Supabase'
      result.style.color = 'crimson'
    }
  })
}
