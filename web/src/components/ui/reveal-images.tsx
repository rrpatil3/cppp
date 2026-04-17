import { cn } from "@/lib/utils";

interface ImageSource {
  src: string;
  alt: string;
}

interface RevealImageListItemProps {
  text: string;
  images: [ImageSource, ImageSource];
}

function RevealImageListItem({ text, images }: RevealImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16";
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-xl";

  return (
    <div className="group relative h-fit w-fit overflow-visible py-6">
      <h1 className="text-6xl font-black tracking-tighter transition-all duration-500 group-hover:opacity-30"
        style={{ color: 'var(--text-primary)' }}>
        {text}
      </h1>
      <div className={container}>
        <div className={effect}>
          <img alt={images[1].alt} src={images[1].src} className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12",
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img alt={images[0].alt} src={images[0].src} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

function RevealImageList() {
  const items: RevealImageListItemProps[] = [
    {
      text: "DSCR Analysis",
      images: [
        {
          src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=60",
          alt: "Financial analysis",
        },
        {
          src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&auto=format&fit=crop&q=60",
          alt: "Loan documents",
        },
      ],
    },
    {
      text: "Credit Memos",
      images: [
        {
          src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&auto=format&fit=crop&q=60",
          alt: "Credit memo",
        },
        {
          src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
          alt: "Business documents",
        },
      ],
    },
    {
      text: "Due Diligence",
      images: [
        {
          src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=200&auto=format&fit=crop&q=60",
          alt: "Due diligence",
        },
        {
          src: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=200&auto=format&fit=crop&q=60",
          alt: "Business review",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-0 rounded-xl px-8 py-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>
        Core Capabilities
      </p>
      {items.map((item, index) => (
        <RevealImageListItem key={index} text={item.text} images={item.images} />
      ))}
    </div>
  );
}

export { RevealImageList };
