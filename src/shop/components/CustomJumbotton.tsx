interface Props {
    title: string;
    subTitle?: string;
}

export const CustomJumbotton = ({ title, subTitle }: Props) => {
    const defaultSubTitle =
        "Ropa minimalista y elegante inspirada en el diseño de Tesla. Calidad alta, con diseño minimalita. Simple pero mejor.";

    return (
        <section className="py-10 px-4 lg:px-8 bg-muted/30">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl lg:text-7xl font-light tracking-tight mb-6">
                    {title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {subTitle || defaultSubTitle}
                </p>
            </div>
        </section>
    );
};
