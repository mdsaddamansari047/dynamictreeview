import { Component, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegralUITreeView } from 'integralui-web-treeview/components/integralui.treeview.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'dynamictree';
    @ViewChild('application', { read: ViewContainerRef }) applicationRef: ViewContainerRef;
    @ViewChild('treeview') treeview: IntegralUITreeView;

    public items: any = [];

    private isEditActive: boolean = false;
    public editItem: any = null;
    private originalText: string = '';
    public editorFocused: boolean = false;
    public hoverItem: any = null;

    public ctrlStyle: any = {
        general: {
            normal: 'trw-add-dynamic'
        }
    }

    private itemCount: number = 1;

    constructor() {
        this.items = [
            { text: "Item 1", item_type: "folder" }
        ];

    }

    // Add/Remove ------------------------------------------------------------------------

    createNewItem() {
        this.itemCount++;

        return { text: "Item " + this.itemCount, item_type: "folder" };
    }

    addRoot(parent: any) {
        let item: any = this.createNewItem();
        // item.item_type = "folder"
        if (parent.pid != null && parent.pid != undefined && parent.pid != '') {
            this.treeview.addItem(item, parent);
        } else {
            this.treeview.addItem(item);
        }
        // this.treeview.addItem(item);
        this.showEditor(item);
    }

    addChild(parent: any) {
        let item: any = this.createNewItem();
        item.item_type = "file"
        this.treeview.addItem(item, parent);
        this.showEditor(item);
    }

    deleteItem(item: any) {
        if (item)
            this.treeview.removeItem(item);
    }

    // Edit ------------------------------------------------------------------------------

    // Selects the whole text in the text editor
    selectContent(e: any) {
        if (e.target) {
            setTimeout(function () {
                e.target.setSelectionRange(0, e.target.value.length);
            }, 1);
        }
    }

    showEditor(item: any) {
        this.originalText = item.text;
        let position = item.text.search("Item");
        if (position >= 0) {
            this.isEditActive = true;
            this.editItem = item;
        } else {
            this.isEditActive = false;
            this.editItem = "";
        }
        this.editorFocused = true;
        item.allowDrag = false;
    }

    closeEditor() {
        if (this.editItem)
            this.editItem.allowDrag = true;

        this.editItem = null;
        this.originalText = '';
        this.editorFocused = false;
    }

    editorKeyDown(e: any) {

        if (this.editItem) {
            switch (e.keyCode) {
                case 13: // ENTER
                    this.editItem.text = e.target.value
                    this.closeEditor();
                    break;

                case 27: // ESCAPE
                    this.editItem.text = this.originalText;
                    this.closeEditor();
                    break;
            }
        }
    }

    editorLostFocus() {
        if (this.editItem)
            this.editItem.text = this.originalText;

        this.closeEditor();
    }
}
