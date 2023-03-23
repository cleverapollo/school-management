import { Page } from '../page';
import { Content } from './content';
import { Header } from './header';
import { TabNavigation } from './tab-navigation';

export const PageContainer = Object.assign(Page, {
  Header,
  TabNavigation,
  Content,
});

if (process.env.NODE_ENV !== 'production') {
  PageContainer.displayName = 'PageContainer';
}
