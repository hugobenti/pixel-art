/**
 * Purpose:
 * Home page: hero with the banner pencil, the three promises, what's inside, how it works, the
 * storage note and the closing call to action.
 */

import Link from "next/link";

import { home } from "@/content/home";
import { BrandLogo } from "@/features/shared/brand/BrandLogo";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { HOME_PROMISE_ICONS, HOME_STEP_NUMBERS } from "./HomeScreen.data";
import { homeScreen } from "./HomeScreen.style";

export function HomeScreen() {
  return (
    <div className={homeScreen.page}>
      <section className={homeScreen.hero}>
        <div className={homeScreen.heroText}>
          <h1 className={homeScreen.title}>{home.h1}</h1>
          <p className={homeScreen.lead}>{home.lead}</p>
          <div className={homeScreen.actions}>
            <Link href="/gallery" className={homeScreen.primary}>
              {home.primary}
            </Link>
            <Link href="/help" className={homeScreen.secondary}>
              {home.secondary}
            </Link>
          </div>
        </div>
        <div className={homeScreen.art}>
          <BrandLogo variant="banner" decorative className={homeScreen.banner} />
        </div>
      </section>

      <section className={homeScreen.promises}>
        {home.promises.map((promise, index) => (
          <div key={promise.title} className={homeScreen.promise}>
            <PublicMaskIcon src={HOME_PROMISE_ICONS[index]} className={homeScreen.promiseIcon} />
            <h2 className={homeScreen.cardTitle}>{promise.title}</h2>
            <p className={homeScreen.cardText}>{promise.text}</p>
          </div>
        ))}
      </section>

      <section className={homeScreen.section}>
        <h2 className={homeScreen.sectionTitle}>{home.insideLabel}</h2>
        <ul className={homeScreen.chips}>
          {home.inside.map((item) => (
            <li key={item} className={homeScreen.chip}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={homeScreen.section}>
        <h2 className={homeScreen.sectionTitle}>{home.stepsTitle}</h2>
        <ol className={homeScreen.steps}>
          {home.steps.map((step, index) => (
            <li key={step.title} className={homeScreen.step}>
              <span className={homeScreen.stepNumber}>{HOME_STEP_NUMBERS[index]}</span>
              <h3 className={homeScreen.cardTitle}>{step.title}</h3>
              <p className={homeScreen.cardText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className={homeScreen.note}>
        {home.storageNote}
        <Link href="/help#saving" className={homeScreen.noteLink}>
          {home.storageLink}
        </Link>
      </p>

      <section className={homeScreen.closing}>
        <h2 className={homeScreen.sectionTitle}>{home.closingTitle}</h2>
        <Link href="/gallery" className={homeScreen.primary}>
          {home.closingCta}
        </Link>
      </section>
    </div>
  );
}
