import SvgIcons from "@/components/SvgIcons";
import Link from "next/link";
import { FC, ReactNode } from "react";
import styles from "@/styles/Update.module.scss";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import DateFormater from "./DateFormater";

const UpdateCard: FC<{
  date: string;
  title: string;
  img: string;
  description: string;
  href: string;
  link: string;

  slug: string;
}> = ({ date, title, img, description, href, link, slug }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });

  return (
    <section className={styles.updateCardWrapper}>
      <div>
        <div className="   md:flex-row md:gap-[175px] lg:px-0  lg:pt-20 ">
          <div>
            <Link href={`/updates/${slug}`}>
              <DateFormater dateString={date} />
            </Link>
          </div>

          <div>
            <Link href={`/updates/${slug}`}>
              <h2>{title}</h2>
            </Link>
            <Image src={img} alt="update-img" height={isMobile ? 175 : 250} width={isMobile ? 350 : 500} />

            <p className="max-w-[550px] ">{description}</p>

            <Link href={href}>
              <span>
                <i>{SvgIcons.carretRight}</i>
                {link}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateCard;
