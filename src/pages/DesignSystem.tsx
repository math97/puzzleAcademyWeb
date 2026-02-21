import React from "react";
import { Text } from "@/core-components/Text";
import { Badge } from "@/core-components/Badge";
import { Button } from "@/core-components/Button";
import { GlassCard } from "@/core-components/GlassCard";
import { Container } from "@/core-components/Container";
import { TIER_CLASSES, type Tier } from "@/lib/tier";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Primitives used only inside this page
// ---------------------------------------------------------------------------

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
            <Text as="h2" variant="h2" glow="cyan" className="shrink-0">
                {title}
            </Text>
            <div className="flex-1 h-px bg-border/40" />
        </div>
        {children}
    </section>
);

const SubSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <Text variant="label" color="muted" className="mb-4 block">
            {label}
        </Text>
        {children}
    </div>
);

interface SwatchProps {
    name: string;
    cssVar: string;
    hex?: string;
    description?: string;
}

const Swatch = ({ name, cssVar, description }: SwatchProps) => (
    <div className="flex flex-col gap-2 min-w-0">
        <div
            className="w-full h-16 rounded-lg border border-white/10"
            style={{ background: `hsl(var(${cssVar}))` }}
        />
        <div className="space-y-0.5">
            <p className="text-xs font-display font-semibold uppercase tracking-wider text-foreground truncate">
                {name}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono truncate">{cssVar}</p>
            {description && (
                <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
            )}
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DesignSystem() {
    const tiers = Object.keys(TIER_CLASSES) as Tier[];

    return (
        <div className="min-h-screen bg-background">
            {/* Page header */}
            <div className="relative overflow-hidden py-16 border-b border-border/40 mb-16">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <Container>
                    <Text as="h1" variant="h1" glow="amber" className="mb-3">
                        Design System
                    </Text>
                    <Text variant="body" color="muted" className="italic">
                        Puzzle Academy — visual language, components, and tokens
                    </Text>
                </Container>
            </div>

            <Container className="pb-24">

                {/* ── 1. COLORS ─────────────────────────────────────────── */}
                <Section title="Colors">
                    <SubSection label="Semantic tokens">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <Swatch name="Primary" cssVar="--primary" description="Cyan — CTAs, active states, glow" />
                            <Swatch name="Accent" cssVar="--accent" description="Gold — Rank #1, header title" />
                            <Swatch name="Secondary" cssVar="--secondary" description="Midnight blue — secondary UI" />
                            <Swatch name="Success" cssVar="--success" description="Positive stats, wins, gains" />
                            <Swatch name="Destructive" cssVar="--destructive" description="Negative stats, losses, errors" />
                        </div>
                    </SubSection>

                    <SubSection label="Surface tokens">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <Swatch name="Background" cssVar="--background" description="Page background" />
                            <Swatch name="Card" cssVar="--card" description="Card surfaces" />
                            <Swatch name="Popover" cssVar="--popover" description="Floating panels" />
                            <Swatch name="Muted" cssVar="--muted" description="Disabled / secondary surfaces" />
                            <Swatch name="Input" cssVar="--input" description="Form inputs" />
                        </div>
                    </SubSection>

                    <SubSection label="Text tokens">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <Swatch name="Foreground" cssVar="--foreground" description="Primary text" />
                            <Swatch name="Muted FG" cssVar="--muted-foreground" description="Secondary / helper text" />
                            <Swatch name="Border" cssVar="--border" description="Dividers and strokes" />
                        </div>
                    </SubSection>
                </Section>

                {/* ── 2. TIER COLORS ────────────────────────────────────── */}
                <Section title="Rank Tiers">
                    <SubSection label="League of Legends rank tiers — each has text, bg/20, and border/40 variants">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {tiers.filter(t => t !== 'UNRANKED').map((tier) => {
                                const cls = TIER_CLASSES[tier];
                                return (
                                    <GlassCard
                                        key={tier}
                                        className={cn(
                                            "p-4 flex flex-col items-center gap-3 border",
                                            cls.border
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-xs font-display font-bold", cls.bg, cls.text)}>
                                            {tier.slice(0, 2)}
                                        </div>
                                        <div className="text-center">
                                            <p className={cn("text-sm font-display font-bold uppercase tracking-wider", cls.text)}>
                                                {tier}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                                {cls.text.replace('text-', '')}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[10px] uppercase", cls.text, cls.border)}>
                                            {tier} I • 75 PDL
                                        </Badge>
                                    </GlassCard>
                                );
                            })}

                            {/* Unranked */}
                            <GlassCard className="p-4 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-display font-bold bg-muted text-muted-foreground">
                                    UN
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-display font-bold uppercase tracking-wider text-muted-foreground">
                                        UNRANKED
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                        muted-foreground
                                    </p>
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground">
                                    UNRANKED
                                </Badge>
                            </GlassCard>
                        </div>
                    </SubSection>
                </Section>

                {/* ── 3. TYPOGRAPHY ─────────────────────────────────────── */}
                <Section title="Typography">
                    <GlassCard className="p-8 space-y-8">
                        <div className="space-y-1">
                            <Text variant="label" color="muted">h1 — Rajdhani 700, text-6xl/8xl, uppercase</Text>
                            <Text as="h1" variant="h1" glow="amber">Puzzle Academy</Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-1">
                            <Text variant="label" color="muted">h2 — Rajdhani 700, text-4xl/5xl, uppercase</Text>
                            <Text as="h2" variant="h2" glow="cyan">Season Leaderboard</Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-1">
                            <Text variant="label" color="muted">h3 — Rajdhani 700, text-xl, truncate</Text>
                            <Text as="h3" variant="h3">ThorMath</Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-1">
                            <Text variant="label" color="muted">h4 — Rajdhani 700, text-lg</Text>
                            <Text as="h4" variant="h4">Champion Masteries</Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-1">
                            <Text variant="label" color="muted">body — Inter, text-base</Text>
                            <Text variant="body">
                                Track your ranked journey across the entire season — every LP gain, every match, every comeback.
                            </Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-1">
                            <Text variant="label" color="muted">label — Inter medium, text-xs, uppercase, tracking-wider</Text>
                            <Text variant="label">Season KDA</Text>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="flex items-end gap-8">
                            <div className="space-y-1">
                                <Text variant="label" color="muted">stat — Rajdhani, text-xl</Text>
                                <Text variant="stat">8.50</Text>
                            </div>
                            <div className="space-y-1">
                                <Text variant="label" color="muted">statValue — Rajdhani, text-3xl</Text>
                                <Text variant="statValue">8.50</Text>
                            </div>
                        </div>
                        <div className="h-px bg-border/40" />
                        <div className="space-y-3">
                            <Text variant="label" color="muted">Color variants</Text>
                            <div className="flex flex-wrap gap-4">
                                <Text color="default">default</Text>
                                <Text color="muted">muted</Text>
                                <Text color="primary">primary</Text>
                                <Text color="accent">accent</Text>
                                <Text color="success">success</Text>
                                <Text color="destructive">destructive</Text>
                            </div>
                        </div>
                    </GlassCard>
                </Section>

                {/* ── 4. BUTTONS ────────────────────────────────────────── */}
                <Section title="Buttons">
                    <SubSection label="Variants">
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="destructive">Destructive</Button>
                        </div>
                    </SubSection>

                    <SubSection label="Sizes">
                        <div className="flex flex-wrap items-center gap-4">
                            <Button variant="primary" size="sm">Small</Button>
                            <Button variant="primary" size="md">Medium</Button>
                            <Button variant="primary" size="lg">Large</Button>
                        </div>
                    </SubSection>

                    <SubSection label="States">
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">Active</Button>
                            <Button variant="primary" disabled>Disabled</Button>
                            <Button variant="outline" disabled>Disabled Outline</Button>
                        </div>
                    </SubSection>
                </Section>

                {/* ── 5. BADGES ─────────────────────────────────────────── */}
                <Section title="Badges">
                    <SubSection label="Variants">
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="primary">Primary</Badge>
                            <Badge variant="outline">Outline</Badge>
                        </div>
                    </SubSection>

                    <SubSection label="Tier badges (via tier utility + outline variant)">
                        <div className="flex flex-wrap gap-3">
                            {tiers.filter(t => t !== 'UNRANKED').map((tier) => {
                                const cls = TIER_CLASSES[tier];
                                return (
                                    <Badge
                                        key={tier}
                                        variant="outline"
                                        className={cn("uppercase", cls.text, cls.border)}
                                    >
                                        {tier} I • 75 LP
                                    </Badge>
                                );
                            })}
                        </div>
                    </SubSection>
                </Section>

                {/* ── 6. CARDS ──────────────────────────────────────────── */}
                <Section title="Cards">
                    <SubSection label="GlassCard — base surface for all player and stat cards">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <GlassCard className="p-6">
                                <Text variant="label" color="muted" className="mb-2">Default</Text>
                                <Text variant="h4">Glass Card</Text>
                                <Text color="muted" className="mt-1 text-sm">
                                    bg-card/40 · backdrop-blur-xl · border-border/50
                                </Text>
                            </GlassCard>

                            <GlassCard hoverEffect className="p-6">
                                <Text variant="label" color="muted" className="mb-2">With hover effect</Text>
                                <Text variant="h4">Hover me</Text>
                                <Text color="muted" className="mt-1 text-sm">
                                    border-primary/50 · cyan glow on hover
                                </Text>
                            </GlassCard>

                            <GlassCard className="p-6 rank-gold">
                                <Text variant="label" color="muted" className="mb-2">Rank #1 (rank-gold)</Text>
                                <Text variant="h4" glow="amber">First Place</Text>
                                <Text color="muted" className="mt-1 text-sm">
                                    amber gradient · amber glow shadow
                                </Text>
                            </GlassCard>
                        </div>
                    </SubSection>
                </Section>

            </Container>
        </div>
    );
}
