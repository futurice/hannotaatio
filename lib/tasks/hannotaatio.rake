namespace :hannotaatio do

	desc "Deploy Hannotaatio to target directory"
	task :deploy, [:target] => [:check_target, :clear, :copy, :chdir, :bundle, :database, :restart]

  desc "Check if target dir is given"
  task :check_target, [:target] do |t, args|
    if !args.target
      raise 'No target specified!'
    else
      puts "Target is #{args.target}"
    end
  end

	desc "Clear target directory"
	task :clear, [:target] do |t, args|
		rm_rf args.target
	end

	desc "Copy all files to target directory"
	task :copy, [:target] do |t, args|
		cp_r ".", args.target
	end

	task :chdir, [:target] do |t, args|
		Dir.chdir(args.target)
		puts "Changed working directory to #{Dir.pwd}"
	end

	desc "Run bundle install"
	task :bundle do
		puts "Run bundle install on #{Dir.pwd}"
		sh "bundle install --path vendor/cache"
	end

	desc "Setup database"
	task :database do
		puts "Run database migration"
		Rake::Task['db:migrate'].invoke
  end

  directory "tmp"
	
	desc "Restart Passenger"
	task :restart => "tmp" do
		puts "Restart Passenger"
		touch "tmp/restart.txt"
  end

  directory "public"

end

