
export type RouterMode = "hash" | "history";
/**
 * vue 将 RouteConfig 改掉了。。。。
 */
export interface _VoyoRouteConfig {
  voyoModule?: () => any;
  pageTitle?: string;
}
export type VoyoRouteConfig = _VoyoRouteConfig & any;

export interface ModuleLoadParam {
  path: string;
  loading: boolean;
}
export interface VoyoRouterParam {
  moduleLoadOrder?: (loadState: ModuleLoadParam) => {}; //use for module load animation
}

export interface RouterOption {
  routerMode?: RouterMode;
  voyoRouterParam: VoyoRouterParam;
  routerConfig: Record<string, any>;
  routes: VoyoRouteConfig[];
}
