/*
 * GPA(Grade Points Average) Calculator
 * 
 * 学分 Credit
 * 成绩 Score
 * 等级 Grade: 优, 良, 及格, 不及格, A+, A, A-....
 * 绩点 Point: 4.0、3.7
 * 学分绩点 GradePoint: Credit * Point
 * 平均学分绩点 GPA
 */
var GPA = GPA || {
	totalCredit: 0,
	totalGradePoint: 0,
	gpa: 0,
	//设置初始的totalCredit，totalGradePoint，gpa均为0
	render: function () {
		var totalCreditElem = $('#totalCredit');
		var totalGradePointElem = $('#totalGradePoint');
		var gpaElem = $('#gpa');
		//把totalCreditElem，totalGradePointElem，gpaElem用全局变量赋值
		this.calculate();
		//调用calculate函数
		if ($.isNumeric(this.totalCredit)) {
			totalCreditElem.val(this.totalCredit);
		}
		if ($.isNumeric(this.totalGradePoint)) {
			totalGradePointElem.val(this.totalGradePoint);
		}
		if ($.isNumeric(this.gpa)) {
			gpaElem.val(this.gpa);
		}
	},
	getCourses: function () {
		return $('.course');
	},
	//返回获得的课程
	calculate: function () {
		this.totalCredit = 0;
		this.totalGradePoint = 0;
		this.gpa = 0;
		//设置初始的totalCredit，totalGradePoint，gpa均为0
		for (var courses = this.getCourses(), i = courses.length; i--; ) {
			//循环courses.length遍次数
			var course = new GPA.Course(courses[i]);
			//course是new一个新的GPA的对象
			this.totalCredit += course.getCredit();
			//学分等于总学分
			this.totalGradePoint += course.getGradePoint();
			//学分
		}
		//
		if (this.totalCredit != 0) {
			this.gpa = this.totalGradePoint / this.totalCredit;
		} else {
			this.gpa = 0;
		}
	}
};

GPA.Rules = {
	MAX_SCORE: 100,
	MIN_SCORE: 0,
	MAX_POINT: 4,
	MIN_POINT: 0,
	grades:[
		{interval: {min: 0, max: 59}, point: 0},
		{interval: {min: 60, max: 63}, point: 1.0},
		{interval: {min: 64, max: 67}, point: 1.7},
		{interval: {min: 68, max: 71}, point: 2.0},
		{interval: {min: 72, max: 74}, point: 2.3},
		{interval: {min: 75, max: 77}, point: 2.7},
		{interval: {min: 78, max: 80}, point: 3.0},
		{interval: {min: 81, max: 84}, point: 3.3},
		{interval: {min: 85, max: 89}, point: 3.7},
		{interval: {min: 90, max: 100}, point: 4}
	],
	scoreToPoint: function (score) {
		var gradeLength = this.grades.length;
		if (score < this.MIN_SCORE) {
			return this.MIN_POINT;
		}
		if (score > this.MAX_SCORE) {
			return this.MAX_POINT;
		}
		for (var i = gradeLength % 2;;) {
			if (score < this.grades[i].interval.min) {
				--i;
				continue;
			}
			if (score > this.grades[i].interval.max) {
				++i;
				continue;
			}
			return this.grades[i].point;
		}
	}
};

GPA.Course = function (courseElem) {
	if (! (this instanceof GPA.Course)) {
		return new GPA.Course(courseElem);
	}
	
	var _getNumber = function (element) {
		var value = Number($(element).val());
		if (isNaN(value)) {
			return 0;
		} else {
			return value;
		}
	};
	
	var course = $(courseElem);
	
	// 学分字段（必须）
	this.creditElem = course.find('.credit')[0];
	
	// 成绩字段（二选一）
	this.scoreElem = course.find('.score')[0];
	
	// 等级字段（二选一）
	this.gradeElem = course.find('.grade')[0];
	
	// 绩点字段（必须）
	this.pointElem = course.find('.point')[0];
	
	// 学分绩点字段 （必须）
	this.gradePointElem = course.find('.gradePoint')[0];
	
	if (! this.creditElem) {
		throw Error('缺少学分输入位置');
	}
	
	if (! (this.scoreElem || this.gradeElem)) {
		throw Error('缺少成绩或者等级输入位置');
	}
	
	if (! this.pointElem) {
		throw Error('没有绩点显示位置');
	}
	
	if (! this.gradePointElem) {
		throw Error('没有学分绩点显示位置');
	}
	
	this.getCredit = function () {
		return _getNumber(this.creditElem);
	};
	
	this.clearCredit = function () {
		$(this.creditElem).val('');
	};
	
	this.getScore = function () {
		if (this.scoreElem) {
			return _getNumber(this.scoreElem);
		} else {
			return 0;
		}
	};
	
	this.isScoreValid = function () {
		if ($.isNumeric($(this.scoreElem).val())) {
			return true;
		}
		
		return false;
	};
	
	this.clearScore = function () {
		if (this.scoreElem) {
			$(this.scoreElem).val('');
		}
	};
	
	this.getGrade = function () {
		if (this.gradeElem) {
			return _getNumber(this.gradeElem);
		} else {
			return 0;
		}
	};
	
	this.isGradeValid = function () {
		var value = $(this.gradeElem).val();
		if (isNaN(value) || value < 0) {
			return false;
		}
		
		return true;
	};
	
	this.clearGrade = function () {
		if (this.gradeElem) {
			$(this.gradeElem).val('');
		}
	};
	
	this.getPoint = function () {
		return _getNumber(this.pointElem);
	};
	
	this.setPoint = function (value) {
		if (isNaN(value)) {
			value = 0;
		}
		$(this.pointElem).val(value);
		
		//一旦设置了绩点，必须重算学分绩点
		this.renderGradePoint();
	};
	
	this.clearPoint = function () {
		this.setPoint('');
	};
	
	this.getGradePoint = function () {
		return _getNumber(this.gradePointElem);
	};
	
	this.setGradePoint = function (value) {
		if (isNaN(value)) {
			value = 0;
		}
		$(this.gradePointElem).val(value);
	};
	
	// 计算学分绩点
	this.renderGradePoint = function () {
		this.setGradePoint(this.getCredit() * this.getPoint());
	};
	
	this.clearGradePoint = function () {
		this.setGradePoint('');
	};
	
	this.clearWidget = function () {
		this.clearCredit();
		this.clearScore();
		this.clearGrade();
		this.clearPoint();
		this.clearGradePoint();
	};
	
	// 根据课程成绩计算绩点
	this.calcPointByScore = function () {
		this.setPoint(GPA.Rules.scoreToPoint(this.getScore()));
	};
	
	this.calcPointByGrade = function () {
		this.setPoint(this.getGrade());
	};
	
	this.resetPoint = function () {
		if (! this.scoreElem) {
			this.calcPointByGrade();
		} else if (! this.gradeElem || this.isScoreValid()) {
			this.calcPointByScore();
		} else {
			this.calcPointByGrade();
		}
	};
	
	this.render = function () {
		this.resetPoint();
	};
	
};

/* Adds a class to the DOM tree */
function AddCourse(elem) {
	var courses = $('.course');
	var gpaForm = $('#GPAForm');
	if (gpaForm) {
		if ((cl=courses.length) > 0) {
			var lastCourse = courses.eq(cl-1);
			var newCourse = lastCourse.clone(true);
			var course = new GPA.Course(newCourse.get(0));
			course.clearWidget();
			newCourse.insertAfter(lastCourse);
			GPA.render();
		}
	}
}

function RemoveCourse(courseElem) {
	var course = $(courseElem);
	var courses = course.parent().find('.course');
	if (courses.length > 1) {
		course.remove();
	}
	GPA.render();
}

function CourseChanged(courseElem) {
	var course = new GPA.Course(courseElem);
	course.render();
	GPA.render();
}

function CourseScoreChanged(courseElem) {
	var course = new GPA.Course(courseElem);
	course.clearGrade();
	course.render();
	GPA.render();
}

function CourseGradeChanged(courseElem) {
	var course = new GPA.Course(courseElem);
	course.clearScore();
	course.render();
	GPA.render();
}

