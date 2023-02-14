export default function ({ children }) {
    const neededLanguages = ['json'];
    const childrenList = Array.isArray(children) ? children : [children];
    const blockLanguages = childrenList.map(child => child.props.children.props.className);
    neededLanguages.forEach(lang => {
        if (!blockLanguages.includes(`language-${lang}`)) throw new Error(`No child with the needed language ${lang}`);
    });
    // TODO: add tab navigation
    return <section>{childrenList}</section>;
}