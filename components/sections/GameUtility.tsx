import { Icon } from '../Icon';
import { SectionHeading } from './SectionHeading';

const steps = [
  {
    icon: 'boxes',
    number: '01',
    title: 'QTX in a player wallet',
    description: 'A player would hold QTX on Base. Miner rewards would come from the existing supply, without creating new tokens.',
  },
  {
    icon: 'gamepad',
    number: '02',
    title: 'Choose a cosmetic item',
    description: 'In the proposed Qryptix web store, players could use QTX for skins and other cosmetic items in participating games.',
  },
  {
    icon: 'check',
    number: '03',
    title: 'Receive it in the game',
    description: 'A connected game would deliver the item to the player account after the purchase has been verified.',
  },
] as const;

export function GameUtility() {
  return (
    <section id="games" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 scroll-mt-24">
      <SectionHeading
        tag="Planned gaming use"
        title={<>Earned in the network. <span className="text-gold">Used in games.</span></>}
        subtitle="The proposed QTX web store would connect a real use for the token to cosmetic items in participating games. This is the intended flow, not a live checkout or a confirmed game partnership."
      />

      <div className="relative grid gap-5 lg:grid-cols-3">
        <div aria-hidden className="hidden lg:block absolute left-[14%] right-[14%] top-11 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
        {steps.map((step) => (
          <div key={step.number} className="relative glass-luxe rounded-3xl p-7 border border-gold/10">
            <div className="flex items-center justify-between mb-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 text-gold">
                <Icon name={step.icon} size={23} />
              </div>
              <span className="font-mono text-xs text-taupe">{step.number} / 03</span>
            </div>
            <h3 className="font-serif text-xl font-medium text-ivory mb-3">{step.title}</h3>
            <p className="text-sm leading-relaxed text-ash">{step.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-3xl mx-auto text-center text-xs leading-relaxed text-taupe">
        Concept only: the web store is not open, no game is connected and no cosmetics can be bought with QTX yet.
        Any mobile game integration depends on a developer agreement and the applicable platform payment rules.
      </p>
    </section>
  );
}
