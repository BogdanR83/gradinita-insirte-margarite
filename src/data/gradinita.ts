export type Location = {
  id: string;
  title: string;
  shortName: string;
  address: string;
  phone: string;
  phoneHref: string;
  mapsUrl: string;
  mapsEmbed: string;
  image?: string;
  imageAlt?: string;
  isMain: boolean;
};

export const kindergarten = {
  name: "Înșir'te Mărgărite",
  fullName: "Grădinița „Înșir'te Mărgărite”",
  sector: "Sector 4, București",
  director: "Tomescu Mirela Daniela",
  email: "gradinitainsirtemargarite@s4.ismb.ro",
  program: "Luni – Vineri: 7:00–18:00",
  locations: [
    {
      id: "principala",
      title: "Sediul principal",
      shortName: "Înșir'te Mărgărite",
      address: "Strada Almașu Mare Nr. 1, București",
      phone: "+4 021 450 3452",
      phoneHref: "tel:+40214503452",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Gradinita+Insir%E2%80%99te+Margarite+Strada+Almasu+Mare+Nr+1+Bucuresti",
      mapsEmbed:
        "https://maps.google.com/maps?q=Gradinita%20Insir'te%20Margarite%20Strada%20Almasu%20Mare%20Nr%201%20Bucuresti&z=16&output=embed",
      image: "/images/cladire-principala-full.jpg",
      imageAlt: "Clădirea Grădiniței Înșir'te Mărgărite",
      isMain: true,
    },
    {
      id: "piticot",
      title: "Sediul Piticot",
      shortName: "Piticot",
      address: "Strada Spiniș 1, București",
      phone: "+4 021 450 3827",
      phoneHref: "tel:+40214503827",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Gradinita+Piticot+Strada+Spinis+1+Bucuresti",
      mapsEmbed:
        "https://maps.google.com/maps?q=Gradinita%20Piticot%20Strada%20Spinis%201%20Bucuresti&z=16&output=embed",
      isMain: false,
    },
  ] as Location[],
};
