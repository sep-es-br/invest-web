import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterModule } from "@angular/router";
import { breadCrumbNames } from "./breadCrumb-data";

@Component({
    selector: 'spo-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrl: 'breadcrumb.component.scss',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink]
})
export class BreadCrumbComponent {
        
    breadcrumb_data : {
        pathName: string,
        pathLink: () => string
    }[] = []
    breadCrumNames  = breadCrumbNames;


    constructor(private route : ActivatedRoute, private router : Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let activeRouter = this.route.snapshot;
                while (activeRouter.children.length > 0) {
                    activeRouter =  activeRouter.firstChild;
                }

                let fullPath = activeRouter.pathFromRoot
                fullPath.shift();

                let data =  fullPath.map((path) => {
                    return {
                        pathName: path.url[0].path,
                        pathLink: () => {
                            let pathLinks = path.pathFromRoot.map(p => p.url)
                            pathLinks.shift();
                            return "/" + pathLinks.map(p => p[0].path).join('/');
                        }
                    }
                });
                this.breadcrumb_data = data
            }
        })

    }
}



