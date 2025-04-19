type AspectOption = {
    label: string;
    icon: IconType;
    value: string;
};

type SelectRatioProp = {
    selectedAspect: AspectOption;
    onChange: (aspect: AspectOption) => void;
};

interface PanelProps {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
}

interface UsedModel {
    name: string,
    description: string,
    images: string[]
}