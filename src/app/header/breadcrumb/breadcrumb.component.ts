import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterModule } from "@angular/router";
import { breadCrumbNames } from "./breadCrumb-data";
import { DataUtilService } from "../../utils/services/data-util.service";

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


    constructor(private route : ActivatedRoute, private router : Router, private dataUtil : DataUtilService) {
        this.dataUtil.headerUpdate.subscribe(value => this.update());
        
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                
                this.update()
            }
        })

    }

    update() {
        let activeRouter = this.route.snapshot;
        while (activeRouter.children.length > 0) {
            activeRouter =  activeRouter.firstChild;
        }

        let fullPath = activeRouter.pathFromRoot
        fullPath.shift();

        
        let data =  fullPath.filter(path => path.url[0] != undefined).map((path) => {


            return {
                pathName: this.breadCrumNames[path.url[0].path] ? 
                            this.breadCrumNames[path.url[0].path] : 
                            path.routeConfig.path.startsWith(":") ? this.dataUtil.titleInfo[path.routeConfig.path.slice(1)]  : "",
                pathLink: () => {
                    let pathLinks = path.pathFromRoot.map(p => p.url)
                    pathLinks.shift();
                    return "/" + pathLinks.map(p => p[0].path).join('/');
                }
            }
        });
        this.breadcrumb_data = data
    }

}



