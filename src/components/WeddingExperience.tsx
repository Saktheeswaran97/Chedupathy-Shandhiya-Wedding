"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Heart,
  Sunrise,
  MoonStar,
  MapPin,
  Menu,
  Music2,
  Pause,
  Phone,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { wedding as w } from "@/lib/content";
import { copy } from "@/lib/translations";
import { buildCalendar } from "@/lib/calendar";
import { asset } from "@/lib/basePath";

type Modal = "invitation" | "photo" | "card" | null;
const validDate = (s: string) => s.length > 0 && Number.isFinite(Date.parse(s));

function downloadFile(text: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function calendarText(event = w.events[0]) {
  return buildCalendar(event, {
    storageKey: w.storageKey,
    groomName: w.groom.name,
    brideName: w.bride.name,
  });
}

export default function WeddingExperience() {
  const [lang, setLang] = useState<"en" | "ta">("en");
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [photo, setPhoto] = useState(0);
  const [card, setCard] = useState(1);
  const [slideshow, setSlideshow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const t = copy[lang];
  const brideName =
    lang === "ta" ? w.bride.tamilName || w.bride.name : w.bride.name;
  const groomName =
    lang === "ta" ? w.groom.tamilName || w.groom.name : w.groom.name;
  const dateLabel = w.dateISO
    ? lang === "ta"
      ? w.tamilDateLabel
      : w.dateLabel
    : t.dateLabel;
  const close = useCallback(() => {
    dialog.current?.close();
    setModal(null);
    setSlideshow(false);
  }, []);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(w.storageKey + ":lang");
      if (storedLang === "ta" || storedLang === "en") setLang(storedLang);
    } catch {
      /* A private browser session can disable local storage. */
    }
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    if (!validDate(w.dateISO)) return;
    const update = () =>
      setTime(Math.max(0, Date.parse(w.dateISO) - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!modal) return;
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    if (!el?.open) el?.showModal();
    el?.querySelector<HTMLButtonElement>(".dialog-close")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [modal]);
  useEffect(() => {
    if (!slideshow || modal !== "photo" || w.gallery.length < 2) return;
    const id = setInterval(
      () => setPhoto((v) => (v + 1) % w.gallery.length),
      4500,
    );
    return () => clearInterval(id);
  }, [slideshow, modal]);

  useEffect(() => {
    if (!w.music) return;
    const startAudio = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.(".music-control")) return;
      const el = audio.current;
      if (el && el.paused) {
        el.volume = 0.4;
        el.play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true });
    return cleanup;
  }, []);

  function toggleLanguage() {
    const next = lang === "en" ? "ta" : "en";
    setLang(next);
    try {
      localStorage.setItem(w.storageKey + ":lang", next);
    } catch {}
  }
  async function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      el.volume = 0.4;
      await el.play();
      setPlaying(true);
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }
  const movePhoto = (direction: number) => {
    if (w.gallery.length)
      setPhoto((v) => (v + direction + w.gallery.length) % w.gallery.length);
  };
  const hasDate = validDate(w.dateISO);

  return (
    <div className={`wedding-app ${lang === "ta" ? "tamil" : ""}`}>
      {w.demoMode && <div className="preview-note">{t.demo}</div>}
      <header className="header">
        <a
          className="wordmark"
          href="#home"
          aria-label={`${w.groom.name} and ${w.bride.name}, home`}
        >
          {w.monogram}
          <span>16 · 11 · 2026</span>
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#celebration" onClick={() => setMenu(false)}>
            {t.celebration}
          </a>
          <a
            className="nav-closing"
            href="#with-love"
            onClick={() => setMenu(false)}
          >
            {t.withLove}
            <ArrowRight size={14} />
          </a>
        </nav>
        <div className="header-actions">
          <button className="language" onClick={toggleLanguage}>
            {t.language}
          </button>
          <button
            className="menu-toggle icon-button"
            onClick={() => setMenu(!menu)}
            aria-label={t.nav}
            aria-expanded={menu}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section-wrap">
          <div className="hero-copy">
            <p className="invocation hero-enter">
              {lang === "ta" ? w.tamilInvocation : w.invocation}
            </p>
            <p className="eyebrow hero-enter">{t.together}</p>
            <h1 className="hero-enter">
              <span>{groomName}</span>
              <span className="ampersand">&</span>
              <span>{brideName}</span>
            </h1>
            <p className="hero-tagline hero-enter">{t.marry}</p>
            <p className="body hero-intro hero-enter">{t.intro}</p>
            <button
              className="button button-burgundy hero-enter"
              onClick={() => setModal("invitation")}
            >
              {t.open}
              <ArrowRight size={17} />
            </button>
            <a className="hero-date" href="#celebration">
              <span className="date-symbol">
                <CalendarDays size={20} />
              </span>
              <span>
                <span className="small-label">{t.save}</span>
                <strong>{dateLabel}</strong>
              </span>
              <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-art hero-enter">
            <div className="hero-photo">
              <Image
                src={w.heroImage}
                alt="C. Chedupathy and N. Shandhiya, together before their wedding"
                fill
                priority
                sizes="(max-width: 760px) 90vw, 48vw"
                className="cover"
              />
            </div>
            <div className="invited-seal">
              <Heart size={19} strokeWidth={1} />
              <span>{t.inviteTitle}</span>
              <span className="seal-monogram">{w.monogram}</span>
            </div>
            <span className="photo-side-note">
              {lang === "ta"
                ? "அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை"
                : "Two hearts. One beautiful beginning."}
            </span>
            <div className="arch-outline" aria-hidden="true" />
          </div>
        </section>

        <section id="invitation" className="letter-section">
          <div className="section-wrap letter-layout reveal">
            <div className="letter-visual" aria-hidden="true">
              <div className="envelope-paper">
                <span>{t.letterSign}</span>
                <strong>{w.monogram}</strong>
              </div>
              <div className="envelope-back" />
              <div className="envelope-front" />
              <span className="wax-seal">{w.monogram}</span>
            </div>
            <div className="letter-copy">
              <p className="eyebrow">{t.letterEyebrow}</p>
              <h2>{t.letterTitle}</h2>
              <p className="body">{t.letterBody}</p>
              <p className="inviting-parents">
                {lang === "ta" ? w.groom.tamilParents : w.groom.parents}
                <br />
                <span>
                  {lang === "ta"
                    ? "அன்புடன் அழைக்கிறோம்"
                    : "warmly invite you to celebrate their son’s wedding"}
                </span>
              </p>
              <button
                className="text-button"
                onClick={() => setModal("invitation")}
              >
                {t.open}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section id="couple" className="couple-section section-wrap">
          <div className="section-heading reveal">
            <p className="eyebrow">{t.meet}</p>
            <h2>{t.meetTitle}</h2>
          </div>
          <div className="couple-grid reveal">
            {[
              {
                person: w.groom,
                name: groomName,
                label: t.groom,
                bio: t.groomBio,
              },
              {
                person: w.bride,
                name: brideName,
                label: t.bride,
                bio: t.brideBio,
              },
            ].map(({ person, name, label, bio }, i) => (
              <article className="person" key={label}>
                <div className={`portrait portrait-${i}`}>
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={name}
                      fill
                      sizes="(max-width: 760px) 80vw, 28vw"
                      className="cover"
                    />
                  ) : (
                    <div className="portrait-placeholder">
                      <span>{name.charAt(0)}</span>
                      <p>{t.portrait}</p>
                    </div>
                  )}
                </div>
                <div className="person-copy">
                  <p className="eyebrow">{label}</p>
                  <h3>{name}</h3>
                  <p className="qualification">{person.qualification}</p>
                  <p className="parents">
                    {lang === "ta" ? person.tamilParents : person.parents}
                  </p>
                  <p className="body">{bio}</p>
                </div>
              </article>
            ))}
            <span className="couple-ampersand" aria-hidden="true">
              &
            </span>
          </div>
          <div className="family-block reveal">
            <div>
              <p className="eyebrow">{t.together}</p>
              <h3>{t.family}</h3>
              <p className="body">{t.familyIntro}</p>
            </div>
            <div className="family-details">
              {w.family.map((f) => (
                <details key={f.title}>
                  <summary>
                    {lang === "ta" ? f.tamilTitle : f.title}
                    <ChevronDown size={18} />
                  </summary>
                  <ul>
                    {(lang === "ta" ? f.tamilMembers : f.members).map(
                      (member) => (
                        <li key={member}>{member}</li>
                      ),
                    )}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="celebration" className="celebration-section">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <p className="eyebrow">{t.schedule}</p>
              <h2>{t.scheduleTitle}</h2>
            </div>
            <div className="events reveal">
              {w.events.map((event, i) => (
                <article className="event" key={event.title}>
                  <div className="event-number">0{i + 1}</div>
                  <div className="event-body">
                    <p className="eyebrow">
                      {lang === "ta" ? event.tamilSubtitle : event.subtitle}
                    </p>
                    <h3>{lang === "ta" ? event.tamilTitle : event.title}</h3>
                    <p>
                      {lang === "ta"
                        ? event.tamilDescription
                        : event.description}
                    </p>
                    <p className="event-location">
                      <MapPin size={16} />
                      {lang === "ta" ? event.tamilVenue : event.venue}
                    </p>
                  </div>
                  <div className="event-when">
                    <CalendarDays size={21} />
                    <strong>
                      {lang === "ta" ? event.tamilDate : event.date}
                    </strong>
                    <span>{lang === "ta" ? event.tamilTime : event.time}</span>
                    <button
                      className="event-calendar"
                      onClick={() =>
                        downloadFile(
                          calendarText(event),
                          i === 0
                            ? "chedupathy-shandhiya-wedding.ics"
                            : "chedupathy-shandhiya-reception.ics",
                          "text/calendar;charset=utf-8",
                        )
                      }
                    >
                      {t.save}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="countdown reveal">
              {hasDate && time !== null ? (
                time === 0 ? (
                  <p className="countdown-note">{t.arrived}</p>
                ) : (
                  <>
                    {[
                      { value: Math.floor(time / 86400000), label: t.days },
                      {
                        value: Math.floor(time / 3600000) % 24,
                        label: t.hours,
                      },
                      {
                        value: Math.floor(time / 60000) % 60,
                        label: t.minutes,
                      },
                      { value: Math.floor(time / 1000) % 60, label: t.seconds },
                    ].map((unit) => (
                      <div key={unit.label}>
                        <strong>{String(unit.value).padStart(2, "0")}</strong>
                        <span>{unit.label}</span>
                      </div>
                    ))}
                  </>
                )
              ) : (
                <p className="countdown-note">
                  {hasDate ? dateLabel : t.datePending}
                </p>
              )}
            </div>
            <div className="calendar-action">
              <button
                className="button button-outline"
                disabled={!hasDate}
                onClick={() => {
                  if (hasDate)
                    downloadFile(
                      calendarText(),
                      "our-wedding.ics",
                      "text/calendar;charset=utf-8",
                    );
                }}
              >
                <CalendarDays size={16} />
                {t.save}
              </button>
              {!hasDate && <p className="hint">{t.calendarPending}</p>}
            </div>
          </div>
        </section>

        <section className="venues-section section-wrap" id="venue">
          <div className="gallery-heading reveal">
            <div>
              <p className="eyebrow">
                {lang === "ta"
                  ? "இரு இடங்கள். ஒரே இனிய நாள்."
                  : "TWO PLACES. ONE BEAUTIFUL DAY."}
              </p>
              <h2>{t.venueTitle}</h2>
            </div>
            <p className="body">
              {lang === "ta"
                ? "காலையில் திருத்தணி. மாலையில் சென்னை. இரண்டு நிகழ்ச்சிகளிலும் குடும்பத்தினருடன் வருகை தந்து சிறப்பிக்கவும்."
                : "A sacred morning in Thiruthani. A joyful evening in Chennai. We look forward to celebrating with you."}
            </p>
          </div>
          <div className="venue-grid">
            {w.events.map((event, i) => (
              <article className="venue-detail reveal" key={event.title}>
                <div className="venue-heading">
                  <MapPin size={23} strokeWidth={1.4} />
                  <span>
                    {lang === "ta"
                      ? event.tamilTitle
                      : i === 0
                        ? "The wedding · Thiruthani"
                        : "The reception · Chennai"}
                  </span>
                </div>
                <h3>{lang === "ta" ? event.tamilVenue : event.venue}</h3>
                <p className="body">
                  {lang === "ta" ? event.tamilAddress : event.address}
                </p>
                <p className="venue-time">
                  {lang === "ta" ? event.tamilTime : event.time}
                </p>
                <a
                  className="text-button"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.directions}
                  <ArrowRight size={17} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="our-day" className="day-story">
          <div className="section-wrap day-story-layout reveal">
            <div className="day-story-image">
              <Image
                src={asset("/photos/a-quiet-moment.jpg")}
                alt="Chedupathy and Shandhiya, a quiet moment together"
                fill
                sizes="(max-width: 760px) 90vw, 45vw"
                className="cover"
              />
              <span className="day-photo-date">
                16<span>NOVEMBER</span>2026
              </span>
            </div>
            <div className="day-story-copy">
              <p className="eyebrow">{t.dayEyebrow}</p>
              <h2>
                {t.dayTitle}
                <em>{t.dayTitleEmphasis}</em>
              </h2>
              <p className="body">{t.dayIntro}</p>
              <div className="day-chapters">
                <article>
                  <Sunrise size={25} strokeWidth={1.2} />
                  <div>
                    <p className="chapter-time">
                      {lang === "ta"
                        ? "காலை 6.00–7.30 · திருத்தணி"
                        : "6:00–7:30 AM · THIRUTHANI"}
                    </p>
                    <h3>{t.morningTitle}</h3>
                    <p>{t.morningBody}</p>
                  </div>
                </article>
                <article>
                  <MoonStar size={25} strokeWidth={1.2} />
                  <div>
                    <p className="chapter-time">
                      {lang === "ta"
                        ? "மாலை 7.00 மணி முதல் · சென்னை"
                        : "7:00 PM ONWARDS · CHENNAI"}
                    </p>
                    <h3>{t.eveningTitle}</h3>
                    <p>{t.eveningBody}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="with-love" className="family-letter section-wrap reveal">
          <p className="eyebrow">{t.familyLetterEyebrow}</p>
          <h2>
            {t.familyLetterTitle}
            <em>{t.familyLetterEmphasis}</em>
          </h2>
          <div className="family-letter-body">
            <span className="letter-heart" aria-hidden="true">
              <Heart size={23} strokeWidth={1.2} />
            </span>
            <p className="family-verse" lang="ta">
              அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை
              <br />
              பண்பும் பயனும் அது.
            </p>
            <p className="verse-credit">
              {lang === "ta" ? "திருக்குறள் · 45" : "THIRUKKURAL · 45"}
            </p>
            <p className="family-letter-message">{t.familyLetterBody}</p>
            <div className="family-signatures">
              <div>
                <span>
                  {lang === "ta"
                    ? "மணமகன் வீட்டார்"
                    : "WITH LOVE, THE GROOM’S FAMILY"}
                </span>
                <p>
                  {lang === "ta" ? "திரு. N.D.சோழன்" : "Mr. N.D. Cholan"}
                  <br />
                  {lang === "ta" ? "திருமதி C.ராஜேஸ்வரி" : "Mrs. C. Rajeswari"}
                </p>
              </div>
              <span className="signature-ampersand" aria-hidden="true">
                &
              </span>
              <div>
                <span>
                  {lang === "ta"
                    ? "மணமகள் வீட்டார்"
                    : "WITH LOVE, THE BRIDE’S FAMILY"}
                </span>
                <p>
                  {lang === "ta" ? "திரு. A.நந்தகோபால்" : "Mr. A. Nanthagopal"}
                  <br />
                  {lang === "ta" ? "திருமதி N.வசந்தி" : "Mrs. N. Vasanthi"}
                </p>
              </div>
            </div>
            <p className="family-letter-closing">{t.familyLetterClosing}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="eyebrow">{t.letterSign}</p>
        <p className="footer-names">
          {groomName}
          <em>&</em>
          {brideName}
        </p>
        <p>{t.footer}</p>
        <div className="family-contacts">
          {w.contacts.map((person) => (
            <a key={person.phone} href={`tel:${person.phone}`}>
              <span>{lang === "ta" ? person.tamilLabel : person.label}</span>
              <strong>
                <Phone size={13} />
                {person.displayPhone}
              </strong>
            </a>
          ))}
        </div>
        <div className="footer-rule" />
        <span>{w.monogram} · 16 NOVEMBER 2026</span>
      </footer>
      {w.music && (
        <>
          <audio
            ref={audio}
            src={w.music}
            loop
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setAudioError(true)}
          />
          <div className="music-control">
            <button
              onClick={toggleMusic}
              aria-label={playing ? t.mute : t.audio}
              aria-pressed={playing}
              title={playing ? t.mute : t.audio}
              className={playing ? "music-button playing" : "music-button"}
            >
              {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {audioError && <span role="status">{t.audioError}</span>}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        className={
          modal === "photo" || modal === "card"
            ? "wedding-dialog photo-dialog"
            : "wedding-dialog"
        }
        aria-labelledby="dialog-title"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (modal === "photo" && e.key === "ArrowLeft") movePhoto(-1);
          if (modal === "photo" && e.key === "ArrowRight") movePhoto(1);
          if (modal === "card" && e.key === "ArrowLeft")
            setCard((v) => (v + 2) % 3);
          if (modal === "card" && e.key === "ArrowRight")
            setCard((v) => (v + 1) % 3);
        }}
      >
        <button
          className="dialog-close icon-button"
          onClick={close}
          aria-label={modal === "photo" ? t.removePhoto : t.close}
          autoFocus
        >
          <X size={23} />
        </button>
        {modal === "invitation" ? (
          <div className="invitation-letter">
            <p className="eyebrow">{t.letterEyebrow}</p>
            <p className="letter-monogram">{w.monogram}</p>
            <h2 id="dialog-title">{t.inviteTitle}</h2>
            <p className="body">{t.letterBody}</p>
            <div className="letter-parent-names">
              {lang === "ta" ? w.groom.tamilParents : w.groom.parents}
            </div>
            <p className="letter-names">
              {groomName}
              <em>&</em>
              {brideName}
            </p>
            <p className="letter-qualification">
              {w.groom.qualification} &amp; {w.bride.qualification}
            </p>
            <div className="letter-parent-names">
              {lang === "ta" ? w.bride.tamilParents : w.bride.parents}
            </div>
            <p className="letter-event-date">{dateLabel}</p>
            <div className="letter-schedule">
              {w.events.map((event) => (
                <div key={event.title}>
                  <strong>
                    {lang === "ta" ? event.tamilTitle : event.title}
                  </strong>
                  <p>{lang === "ta" ? event.tamilTime : event.time}</p>
                  <p>{lang === "ta" ? event.tamilVenue : event.venue}</p>
                  <p>{lang === "ta" ? event.tamilAddress : event.address}</p>
                </div>
              ))}
            </div>
            <button
              className="printed-button text-button"
              onClick={() => {
                setCard(lang === "ta" ? 2 : 1);
                setModal("card");
              }}
            >
              {lang === "ta"
                ? "அசல் அழைப்பிதழைப் பார்க்க"
                : "View the printed invitation"}
              <ArrowRight size={16} />
            </button>
            <button
              className="text-button"
              onClick={() => {
                close();
                document.querySelector("#with-love")?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                });
              }}
            >
              {t.withLove}
              <ArrowRight size={17} />
            </button>
          </div>
        ) : modal === "card" ? (
          <div className="lightbox">
            <h2 id="dialog-title" className="sr-only">
              {lang === "ta"
                ? "அசல் திருமண அழைப்பிதழ்"
                : "The original wedding invitation"}
            </h2>
            <div className="lightbox-image invitation-scan">
              <Image
                src={w.printedInvitations[card].src}
                alt={w.printedInvitations[card].alt}
                fill
                sizes="95vw"
                className="contain"
              />
            </div>
            <div className="card-tabs">
              {w.printedInvitations.map((page, i) => (
                <button
                  key={page.src}
                  className={i === card ? "active" : ""}
                  aria-pressed={i === card}
                  onClick={() => setCard(i)}
                >
                  {lang === "ta" ? page.tamilLabel : page.label}
                </button>
              ))}
              <a
                href={w.printedInvitations[card].src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === "ta" ? "பெரிதாக்கிப் பார்க்க" : "Open full size"}
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        ) : modal === "photo" && w.gallery[photo] ? (
          <div className="lightbox">
            <h2 id="dialog-title" className="sr-only">
              {w.gallery[photo].alt}
            </h2>
            <div className="lightbox-image">
              <Image
                src={w.gallery[photo].src}
                alt={w.gallery[photo].alt}
                fill
                sizes="95vw"
                className="contain"
              />
            </div>
            <div className="lightbox-controls">
              <button
                className="icon-button"
                onClick={() => movePhoto(-1)}
                aria-label={t.previous}
              >
                <ArrowLeft />
              </button>
              <span>
                {photo + 1} / {w.gallery.length}
              </span>
              <button
                className="icon-button"
                onClick={() => setSlideshow(!slideshow)}
                aria-label={
                  slideshow
                    ? lang === "ta"
                      ? "படக்காட்சியை நிறுத்து"
                      : "Pause slideshow"
                    : lang === "ta"
                      ? "படக்காட்சியை இயக்கு"
                      : "Play slideshow"
                }
              >
                {slideshow ? <Pause /> : <Play />}
              </button>
              <button
                className="icon-button"
                onClick={() => movePhoto(1)}
                aria-label={t.next}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
