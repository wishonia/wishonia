import { File, GithubLogo, Globe } from "@phosphor-icons/react"
import {DatasourceType} from "@prisma/client";

interface Props{
    iconName?:string|null,
    className?:string
}

const DataSourceIcon = ({ iconName = 'FILE', className }: Props) => {
    switch(iconName){
        case "FILE":
            return <File className={className}/>
        case DatasourceType.PDF:
            return <File className={className}/>
        case DatasourceType.URL:
            return <Globe className={className}/>
        case DatasourceType.GITHUB_REPOSITORY:
            return <GithubLogo className={className}/>
        default:
            return <File className={className}/>
    }
}

export default DataSourceIcon;