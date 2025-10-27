import { Link } from 'react-router';
import parse from 'html-react-parser';
import { createElement } from 'react';
import { MenuItem } from '@/types/app';
import { useMediaQuery } from "react-responsive";
import { fallbackMenuItems, instanceURI } from '@/lib/config';
import { useAppData } from '@/context/app-context';
import { Braces, Brackets, Code, Code2, House, Server } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const codeIconMap = {
  Code: Code,
  Code2: Code2,
  Braces: Braces,
  Brackets: Brackets,
  Server: Server,
};

const mapListItem = (items: MenuItem[], single: boolean) => {
  return items.map((item, i) => {
    const isLastOdd = items.length % 2 !== 0 && i === items.length - 1;
    return (
      <ListItem
        key={item.title}
        title={item.title}
        href={item.href}
        target={item.target}
        className={isLastOdd && !single ? 'xl:col-span-2' : ''}
      >
        {item.description}
      </ListItem>
    );
  });
};

function IconFromString({ iconString }: { iconString?: string }) {
  const baseStyle = 'size-5 text-muted-foreground mr-2';
  if (!iconString) return null;

  if (iconString.trim().startsWith('<svg')) {
    const svgString = iconString.replace('lucide', `lucide ${baseStyle}`);
    return parse(svgString);
  }

  const target = codeIconMap[iconString as keyof typeof codeIconMap];
  if (target) {
    return createElement(target, { className: baseStyle });
  }

  return null;
}

export function NavMenu() {
  const ulSingle = 'w-[300px]';
  const ulMulti = 'grid-cols-2 w-[600px]';
  const navButtonClasses = 'text-base font-medium py-0 px-3 items-center';
  const navLinkClasses = `${navigationMenuTriggerStyle()} ${navButtonClasses}`;

  const { config } = useAppData();
  const isXLUp = useMediaQuery({ minWidth: 1536 });
  const appMenu = config.menu || fallbackMenuItems;

  return (
    <NavigationMenu viewport={!isXLUp} className="relative z-50">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navLinkClasses}>
            <Link to="/">
              <div className="flex items-center gap-2 text-base font-medium">
                <House className="size-5" />
                Home
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {appMenu.map(menu => {
          const single = menu.type === 'single';
          return (
            <NavigationMenuItem key={menu.label}>
              <NavigationMenuTrigger className={navButtonClasses}>
                <IconFromString iconString={menu.icon} />
                {menu.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className={`grid gap-2 ${single ? ulSingle : ulMulti}`}>{mapListItem(menu.items, single)}</ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  target,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string; target?: string }) {
  const replacedHref = href.replace('INSTANCE_URI', instanceURI);
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={replacedHref} target={target}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
