import {
    File,
    GithubLogo,
    Globe
  } from "@phosphor-icons/react"


const getIcon=(Icon:string|null,className:string|undefined)=>{
    switch(Icon){
        case "FILE":
            return <File className={className}/>
        case "PDF":
            return <File className={className}/>
        case "URL":
            return <Globe className={className}/>
        case "GITHUB_REPOSITORY":
            return <GithubLogo className={className}/>
        default:
            return <File className={className}/>
    }
}

interface Props{
    iconName?:string|null,
    className?:string
}

const DataSourceIcon = ({ iconName = 'FILE', className }: Props) => {
    const Icon = getIcon(iconName, className);
    return Icon;
}

export default DataSourceIcon;