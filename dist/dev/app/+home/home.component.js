"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var index_1 = require('../shared/index');
var HomeComponent = (function () {
    function HomeComponent(nameListService) {
        this.nameListService = nameListService;
        this.newName = '';
        this.names = [];
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.getNames();
    };
    HomeComponent.prototype.getNames = function () {
        var _this = this;
        this.nameListService.get()
            .subscribe(function (names) { return _this.names = names; }, function (error) { return _this.errorMessage = error; });
    };
    HomeComponent.prototype.addName = function () {
        this.names.push(this.newName);
        this.newName = '';
        return false;
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'sd-home',
            templateUrl: 'home.component.html',
            styleUrls: ['home.component.css'],
        }), 
        __metadata('design:paramtypes', [index_1.NameListService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC8raG9tZS9ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQWtDLGVBQWUsQ0FBQyxDQUFBO0FBQ2xELHNCQUFnQyxpQkFBaUIsQ0FBQyxDQUFBO0FBWWxEO0lBWUUsdUJBQW1CLGVBQWdDO1FBQWhDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQVZuRCxZQUFPLEdBQVcsRUFBRSxDQUFDO1FBRXJCLFVBQUssR0FBVSxFQUFFLENBQUM7SUFRb0MsQ0FBQztJQUt2RCxnQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFLRCxnQ0FBUSxHQUFSO1FBQUEsaUJBTUM7UUFMQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTthQUNSLFNBQVMsQ0FDUixVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFsQixDQUFrQixFQUMzQixVQUFBLEtBQUssSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLEdBQVEsS0FBSyxFQUE5QixDQUE4QixDQUN2QyxDQUFDO0lBQ3ZCLENBQUM7SUFNRCwrQkFBTyxHQUFQO1FBRUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBaERIO1FBQUMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ2xDLENBQUM7O3FCQUFBO0lBNkNGLG9CQUFDO0FBQUQsQ0EzQ0EsQUEyQ0MsSUFBQTtBQTNDWSxxQkFBYSxnQkEyQ3pCLENBQUEiLCJmaWxlIjoiYXBwLytob21lL2hvbWUuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hbWVMaXN0U2VydmljZSB9IGZyb20gJy4uL3NoYXJlZC9pbmRleCc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBsYXp5IGxvYWRlZCBIb21lQ29tcG9uZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdzZC1ob21lJyxcbiAgdGVtcGxhdGVVcmw6ICdob21lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2hvbWUuY29tcG9uZW50LmNzcyddLFxufSlcblxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIG5ld05hbWU6IHN0cmluZyA9ICcnO1xuICBlcnJvck1lc3NhZ2U6IHN0cmluZztcbiAgbmFtZXM6IGFueVtdID0gW107XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIEhvbWVDb21wb25lbnQgd2l0aCB0aGUgaW5qZWN0ZWRcbiAgICogTmFtZUxpc3RTZXJ2aWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge05hbWVMaXN0U2VydmljZX0gbmFtZUxpc3RTZXJ2aWNlIC0gVGhlIGluamVjdGVkIE5hbWVMaXN0U2VydmljZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lTGlzdFNlcnZpY2U6IE5hbWVMaXN0U2VydmljZSkge31cblxuICAvKipcbiAgICogR2V0IHRoZSBuYW1lcyBPbkluaXRcbiAgICovXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZ2V0TmFtZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgdGhlIG5hbWVMaXN0U2VydmljZSBvYnNlcnZhYmxlXG4gICAqL1xuICBnZXROYW1lcygpIHtcbiAgICB0aGlzLm5hbWVMaXN0U2VydmljZS5nZXQoKVxuICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZXMgPT4gdGhpcy5uYW1lcyA9IG5hbWVzLFxuICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiAgdGhpcy5lcnJvck1lc3NhZ2UgPSA8YW55PmVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUHVzaGVzIGEgbmV3IG5hbWUgb250byB0aGUgbmFtZXMgYXJyYXlcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2UgdG8gcHJldmVudCBkZWZhdWx0IGZvcm0gc3VibWl0IGJlaGF2aW9yIHRvIHJlZnJlc2ggdGhlIHBhZ2UuXG4gICAqL1xuICBhZGROYW1lKCk6IGJvb2xlYW4ge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBuYW1lTGlzdFNlcnZpY2UucG9zdFxuICAgIHRoaXMubmFtZXMucHVzaCh0aGlzLm5ld05hbWUpO1xuICAgIHRoaXMubmV3TmFtZSA9ICcnO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59XG4iXX0=
