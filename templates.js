var templates = {
	hero: {
		fields: {
			name: {left:10, top:10, width: 280},
			strength: {left:10, top:50, width: 280, color:"#101010", format:"S {0}"},
			int: {left:10, top:70, width: 280, color:"#101010", format:"I {0}"},
			luck: {left:10, top:90, width: 280, color:"#101010", format:"L {0}"}
		}
	},
	hazard: {
		fields: {
			title: {left:10, top:10, width: 280},
			strength: {left:10, top:50, width: 280, color:"#101010", format:"S {0}"},
			int: {left:10, top:70, width: 280, color:"#101010", format:"I {0}"},
			luck: {left:10, top:90, width: 280, color:"#101010", format:"L {0}"},
			effect: {left:10, top:300, width: 280, color:"#FF1010", format:"effect: {0}"}
		}
	},
	default: {
		fields: {
			title: {left:10, top:10, width: 280},
			text: {left:10, top:50, width: 280, color:"#101010"}
		}
	}
};