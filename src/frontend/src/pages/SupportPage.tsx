import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { PartnerLayout } from "../components/layouts/PartnerLayout";
import { PageHeader } from "../components/ui/PageHeader";

export default function SupportPage() {
  return (
    <PartnerLayout>
      <PageHeader title="Support" subtitle="We're here to help you" />

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Card 1 — Call Lab */}
        <div data-ocid="support.call_card" className="card-elevated p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight">
                Call Lab
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Speak directly with our team
              </p>
              <p className="text-foreground font-semibold text-sm mt-1 font-mono">
                +91-XXXXXXXXXX
              </p>
            </div>
          </div>
          <a
            href="tel:+91XXXXXXXXXX"
            data-ocid="support.call_button"
            className="btn-primary w-full text-center text-sm py-2.5 block"
          >
            Call Mediyra Lab
          </a>
        </div>

        {/* Card 2 — WhatsApp Support */}
        <div data-ocid="support.whatsapp_card" className="card-elevated p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight">
                WhatsApp Support
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Quick replies on WhatsApp
              </p>
              <p className="text-foreground font-semibold text-sm mt-1 font-mono">
                +91-XXXXXXXXXX
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi%20Mediyra%20Lab%2C%20I%20need%20support."
            target="_blank"
            rel="noreferrer"
            data-ocid="support.whatsapp_button"
            className="btn-accent w-full text-center text-sm py-2.5 block"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Card 3 — Lab Address */}
        <div data-ocid="support.address_card" className="card-elevated p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight mb-2">
                Lab Address
              </h3>
              <address className="not-italic text-sm text-foreground leading-relaxed">
                <span className="font-semibold">Mediyra Lab</span>
                <br />
                123 Medical Complex
                <br />
                Vadodara, Gujarat 390001
              </address>
            </div>
          </div>
        </div>

        {/* Card 4 — Lab Hours */}
        <div data-ocid="support.hours_card" className="card-elevated p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight mb-3">
                Lab Hours
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Mon – Sat
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    7:00 AM – 8:00 PM
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sunday</span>
                  <span className="text-sm font-semibold text-foreground">
                    8:00 AM – 2:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom urgent note */}
        <div
          data-ocid="support.urgent_note"
          className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3"
        >
          <MessageCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-snug">
            <span className="font-semibold">For urgent support,</span> WhatsApp
            is the fastest way to reach us.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </PartnerLayout>
  );
}
