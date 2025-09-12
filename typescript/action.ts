export type Image = {
    url: string;
    title: string;
    uid: string;
    $: {
        title: string;
        alt: string;
    };
};

export type Action = {
    title: string;
    href: string;
    $: {
        title: string;
    };
};
